import { getAgencies } from "@/actions/admin/agency";
import { getAdminTopicList, getQuestionsList } from "@/actions/admin/question";
import { Paginator } from "@/components/client/paginator";
import Translator from "@/components/client/translator";
import { FSP, inject } from "@/lib/decorator";
import MustBeAuthenticated from "@/middlewares/injectors/must-be-authenticated";
import MustBeAuthorized from "@/middlewares/injectors/must-be-authorized";
import { Agency, PageResult, Question, Topic } from "@/types/types";
import { Empty } from "@askgovmy/ui";
import { DateTime } from "luxon";
import ManageQuestionsFilter from "./filters";
import { cn } from "@askgovmy/utils";
import { AdminContent, AdminFloatButton } from "./super-admin";
import ContentDialog from "./content-dialog";
import { StaffContent, StaffFloatButton } from "./staff";

interface ForAdminProps {
  role: "super_admin";
  questions: PageResult<Question>;
  agencies: PageResult<Agency>;
  topics: never;
  count: number;
}

interface ForStaffProps {
  role: "staff";
  questions: PageResult<Question>;
  agencies: never;
  topics: Topic[];
  count: number;
}

type ManageQuestionsProps = ForAdminProps | ForStaffProps;

const AdminDashboardPage: FSP<ManageQuestionsProps> = async ({ data }) => {
  const { agencies, questions, role, count, topics } = data!;
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
              <ContentDialog
                key={JSON.stringify(question)}
                role={role}
                question={question}
                agencies={agencies?.results}
                topics={topics}
              >
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
                  {role === "staff" && <StaffContent question={question} />}

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
                      <StaffFloatButton question={question} topics={topics} />
                    )}
                  </div>
                </div>
              </ContentDialog>
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
      const [
        { data: questions },
        { data: questionsCount },
        { data: agencies },
      ] = await Promise.all([
        getQuestionsList(
          {
            page,
            search,
            ...(agency !== "all" && { agency }),
            ...(state !== "all" && { state }),
          },
          context
        ),
        // Get the count for unassigned
        getQuestionsList({ state: "unassigned" }, context),
        getAgencies({ page_size: 999 }, context),
      ]);

      return {
        role: "super_admin",
        questions,
        agencies,
        count: questionsCount?.page.total,
      };
    }

    // For staff
    const [{ data: questions }, { data: questionsCount }, { data: topics }] =
      await Promise.all([
        getQuestionsList(
          {
            page,
            search,
            ...(state !== "all" && { state }),
          },
          context
        ),
        // Get the count for unassigned
        getQuestionsList({ state: "unanswered" }, context),
        getAdminTopicList(
          { agency: context.session?.user.agency?.id },
          context
        ),
      ]);

    return {
      role: "staff",
      questions,
      count: questionsCount?.page.total,
      topics,
    };
  },
});
