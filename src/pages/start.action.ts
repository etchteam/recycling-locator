import { ActionFunctionArgs, redirect } from 'react-router-dom';

import PostCodeResolver from '@/lib/PostcodeResolver';
import createSearchParams from '@/lib/createSearchParams';

function handleError(error: Error) {
  if (error instanceof Error) {
    if (
      [
        PostCodeResolver.ERROR_NOT_IN_UK,
        PostCodeResolver.ERROR_POSTCODE_NOT_FOUND,
        PostCodeResolver.ERROR_SEARCH_FAILED,
      ].includes(error.message)
    ) {
      throw new Response(error.message, { status: 404 });
    }
  }

  throw error;
}

export async function resolvePostcode(formData: FormData) {
  const location = formData.get('location') as string;
  return PostCodeResolver.fromString(location);
}

export async function homeRecyclingStartAction({
  request,
}: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const postcode = await resolvePostcode(formData);
    return redirect(`/${postcode}/home`);
  } catch (error) {
    handleError(error);
  }
}

export async function materialStartAction({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const postcode = await resolvePostcode(formData);
    const searchParams = createSearchParams(
      ['materials', 'category', 'search'],
      formData,
    );

    return redirect(`/${postcode}/material?${searchParams.toString()}`);
  } catch (error) {
    handleError(error);
  }
}

export default async function startAction({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const postcode = await resolvePostcode(formData);
    return redirect(`/${postcode}`);
  } catch (error) {
    handleError(error);
  }
}
