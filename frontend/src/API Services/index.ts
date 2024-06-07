'use server'
import { db } from "@/db/prismaService";

// export async function fetchQuestions() {
//     return await db.question.findMany();
//   }
  
// export async function submitQuestion(title: string, description: string) {
//   return await db.question.create({
//     data: { title, description },
//   });
// }

interface Agency {
  id: number;
  name: string;
  slug: string;
  projectId: string;
  apiKey: string;
}

 interface Question {
  id: string;
  name: string;
  description_html: string;
}

export async function fetchAgencyQuestions(agencyName: string) {
  const agency: Agency | null = await db.agency.findUnique({
    where: { name: agencyName },
  });

  if (agency === null) {
    throw new Error(`Agency ${agencyName} not found`);
  } //just adding throw new error to hide ts syntax highlight

  const url = `https://api.plane.so/api/v1/workspaces/${agency.slug}/projects/${agency.projectId}/issues/`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-API-Key': agency.apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`${response.statusText}`);
  }

  const data = await response.json();
  return data.results; // all issues or questions are nested inside the results array
}


export async function submitQuestion(name: string, description_html: string, agencyName: string) { //title = name, description = description_html
  const agency : Agency | null = await db.agency.findUnique({ 
    where: { name: agencyName },
  });

  if (agency === null) {
    throw new Error(`Agency ${agencyName} not found`);
  }

  const url = `https://api.plane.so/api/v1/workspaces/${agency.slug}/projects/${agency.projectId}/issues/`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'X-API-Key': agency.apiKey,
    },
    body: JSON.stringify({
      name,
      description_html,
    }),
  });

  if (!response.ok) {
    throw new Error(`${response.statusText}`);
  }
  
  const data = await response.json();
  console.log(data);
  
  const result = { //re-declare the attributes back to the naming components is using 
    id: data.id,
    title: data.name,
    description: data.description_html
  }

  return result
}

export async function questionDetail(questionId:string, agencyName:string, title:string, description:string) {
  const agency: Agency | null = await db.agency.findUnique({ // the title and description is being send from components to save time from making another request
    where: { name: agencyName },
  });

  if (agency === null) {
    throw new Error(`Agency ${agencyName} not found`);
  }
  
  const url = `https://api.plane.so/api/v1/workspaces/${agency.slug}/projects/${agency.projectId}/issues/${questionId}/comments`;
  const response = await fetch(url, {
    method: 'get',
    headers: {
      'X-API-Key': agency.apiKey,
    },
  });
  const data = await response.json();

  if (data.results.length > 0) { //if comments exists, send back to components with the detail
    const result = {
      id:data.id,
      title: title,
      description: description,
      detail: data.results[0].comment_html
    }
    return result
    
  } else {
    const result = { // if doesnt exist, send back as null
      id:data.id,
      title: title,
      description: description,
      detail: null
    }
    return result
  }
}

