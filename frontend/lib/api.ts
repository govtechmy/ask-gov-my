import { StatusCodes } from 'http-status-codes';

const default_option: RequestInit = {
  headers: { 'Content-Type': 'application/json' },
  cache: 'no-store',
};

export const post = async <T>(
  path: string,
  payload: Record<string, any>,
  option: RequestInit = default_option,
) =>
  new Promise<T | null>(async (resolve, reject) => {
    fetch(path, {
      method: 'POST',
      body: JSON.stringify(payload),
      ...option,
    })
      .then(response => {
        // Check if the response body is null
        if (response.body === null) {
          resolve(null);
        }
        resolve(response.json() as T);
      })
      .catch(error => reject(error));
  });

export const get = async <T>(
  path: string,
  payload?: Record<string, any>,
  option: RequestInit = default_option,
) =>
  new Promise<T | null>(async (resolve, reject) => {
    fetch(`${path}?${new URLSearchParams(payload).toString()}`, {
      method: 'GET',
      ...option,
    })
      .then(response => {
        // Check if the response body is null
        if (response.body === null) {
          resolve(null);
        }
        try {
          const item = response.json() as T;
          resolve(item);
        } catch (error) {
          resolve(response.body as T);
        }
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });
  });

export const put = async <T>(
  path: string,
  payload: Record<string, any>,
  option: RequestInit = default_option,
) =>
  new Promise<T | null>(async (resolve, reject) => {
    fetch(path, {
      method: 'PUT',
      body: JSON.stringify(payload),
      ...option,
    })
      .then(response => {
        if (!response.ok) {
          if (response.status === StatusCodes.NO_CONTENT) return null;
          else throw new Error('Network response was not ok');
        }
        if (response.body === null) {
          resolve(null);
        }
        resolve(response.json() as T);
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });
  });
