import { getAgencies } from "@/actions/admin/agency";
import { getQuestionsList } from "@/actions/admin/question";
import { Paginator } from "@/components/client/paginator";
import Translator from "@/components/client/translator";
import { FSP, inject } from "@/lib/decorator";
import MustBeAuthenticated from "@/middlewares/injectors/must-be-authenticated";
import MustBeAuthorized from "@/middlewares/injectors/must-be-authorized";
import { Agency, PageResult, Question } from "@/types/types";
import { Button, Empty, PencilIcon } from "@askgovmy/ui";
import { DateTime } from "luxon";
import ManageQuestionsFilter from "./filters";
import { cn } from "@askgovmy/utils";
import { EyeIcon } from "lucide-react";
import { AdminContent, AdminFloatButton } from "./super-admin";

interface ForAdminProps {
  role: "super_admin";
  questions: PageResult<Question>;
  agencies: PageResult<Agency>;
  count: number;
}

interface ForStaffProps {
  role: "staff";
  questions: PageResult<Question>;
  agencies: never;
  count: number;
}

type ManageQuestionsProps = ForAdminProps | ForStaffProps;

const AdminDashboardPage: FSP<ManageQuestionsProps> = async ({ data }) => {
  const { agencies, questions, role, count } = data!;
  return (
    <div className="space-y-6">
      {role === "staff" && (
        <ManageQuestionsFilter
          role={role}
          agencies={undefined as never}
          count={count}
        />
      )}
      {role === "super_admin" && (
        <ManageQuestionsFilter
          agencies={agencies.results}
          role={role}
          count={count}
        />
      )}
      <Empty
        from={questions.results}
        message={
          <Translator
            namespace="AdminQuestions.not_found"
            className="text-dim-500 lg:w-[500px]"
          />
        }
      >
        <div className="grid grid-cols-1 gap-2">
          {questions.results.map((question) => {
            return (
              <div
                key={question.id}
                className={cn(
                  "rounded-lg border lg:h-20 py-4 px-5 bg-white text-sm flex gap-3 relative group hover:bg-background hover:border-outline-300 flex-wrap flex-col lg:flex-row items-start lg:items-center",
                  role === "staff" &&
                    !question.answer &&
                    "hover:cursor-pointer",
                  role === "super_admin" && "hover:cursor-pointer"
                )}
              >
                {role === "staff" && (
                  <>
                    <div className="w-[125px]">
                      {question.answer ? (
                        question.answer.draft ? (
                          <Translator
                            className="rounded-full gap-1.5 py-0.5 px-2 bg-washed-100 text-dim-500 w-fit"
                            namespace="AdminQuestions.state.draft"
                            prefix={
                              <span className="w-2 h-2 bg-dim-500 rounded-full" />
                            }
                          />
                        ) : (
                          <Translator
                            className="rounded-full gap-1.5 py-0.5 px-2 bg-askmygovbrand-50 text-askmygovtextbrand-600 w-fit"
                            namespace="AdminQuestions.state.answered"
                            prefix={
                              <span className="w-2 h-2 bg-askmygovtextbrand-600 rounded-full" />
                            }
                          />
                        )
                      ) : (
                        <Translator
                          className="rounded-full gap-1.5 py-0.5 px-2 bg-success-50 text-success-700 w-fit"
                          namespace="AdminQuestions.new"
                          prefix={
                            <span className="w-2 h-2 bg-success-700 rounded-full" />
                          }
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-black-700 line-clamp-1 ">
                        {question.question}
                      </p>
                      {question.answer && (
                        <p className="text-dim-500 line-clamp-1 flex-1">
                          {question.answer.text}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {role === "super_admin" && (
                  <AdminContent
                    question={question}
                    agencies={agencies.results}
                  />
                )}

                <p className="text-dim-500 text-right">
                  {DateTime.fromISO(question.created_at).toFormat(
                    "dd MMM yyyy, hh:mm a"
                  )}
                </p>
                <div className="absolute flex h-full w-14 right-5 bg-gradient-to-b from-background/0 to-background/100 justify-end py-4 transition-all items-center gap-2">
                  {role === "super_admin" && (
                    <AdminFloatButton question={question} />
                  )}
                  {role === "staff" && question.answer && (
                    <>
                      {!question.answer.draft && (
                        <Button
                          className="w-8 h-8 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          variant={"secondary"}
                          size={"sm"}
                          icon={
                            <EyeIcon className="w-4 h-4 stroke-black-700" />
                          }
                        />
                      )}
                      <Button
                        className="h-8 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        variant={"secondary"}
                        size={"sm"}
                      >
                        <PencilIcon className="w-4 h-4 stroke-black-700" />
                        <Translator
                          namespace="AdminQuestions.edit"
                          tag="span"
                        />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Empty>
      {questions.page.max > 1 && (
        <Paginator data={questions.page} route="admin.dashboard.index" />
      )}
    </div>
  );
};

export default inject(AdminDashboardPage, {
  // debug: true,
  middleware: [MustBeAuthenticated, MustBeAuthorized(["staff", "super_admin"])],
  async data({ searchParams, context }) {
    const { page = 1, search = "", state, agency } = searchParams;

    if (context.session?.user.role === "super_admin") {
      // For super admin
      const { data: questions } = await getQuestionsList(
        {
          page,
          search,
          ...(agency !== "all" && { agency }),
          ...(state !== "all" && { state }),
        },
        context
      );
      // Get the count for unassigned
      const { data: questionsCount } = await getQuestionsList(
        { state: "unassigned" },
        context
      );
      const { data: agencies } = await getAgencies({ page_size: 999 }, context);

      return {
        role: "super_admin",
        questions,
        agencies,
        count: questionsCount?.page.total,
      };
    }

    // For staff
    const { data: questions } = await getQuestionsList(
      {
        page,
        search,
        ...(state !== "all" && { state }),
      },
      context
    );

    // Get the count for unassigned
    const { data: questionsCount } = await getQuestionsList(
      { state: "unanswered" },
      context
    );
    return {
      role: "staff",
      questions,
      count: questionsCount?.page.total,
    };
  },
});
