import { ActionFunctionArgs, redirect } from 'react-router';

import PostCodeResolver from '@/lib/PostcodeResolver';
import mapSearchParams from '@/lib/mapSearchParams';

function handleError(error: Error) {
  if (error instanceof Error) {
    if (
      [
        PostCodeResolver.ERROR_NOT_IN_UK,
        PostCodeResolver.ERROR_POSTCODE_NOT_FOUND,
        PostCodeResolver.ERROR_SEARCH_FAILED,
        PostCodeResolver.ERROR_POSTCODE_TYPO,
      ].includes(error.message)
    ) {
      if (
        error.message === PostCodeResolver.ERROR_POSTCODE_TYPO &&
        error.cause
      ) {
        throw new Response(error.message, {
          status: 404,
          statusText: String(error.cause),
        });
      }
      throw new Response(error.message, { status: 404 });
    }
  }

  throw error;
}

function resolvePostcode(formData: FormData) {
  const location = formData.get('location') as string;
  const lat = Number(formData.get('lat'));
  const lng = Number(formData.get('lng'));

  if (lat && lng) {
    return PostCodeResolver.fromLatLng(lat, lng);
  }

  return PostCodeResolver.fromString(location);
}

async function handleRedirect(formData: FormData, path = '') {
  const postcode = await resolvePostcode(formData);
  const openInNewTab = formData.get('new-tab') === 'yes';
  const route = `/${postcode}${path}`;

  if (openInNewTab) {
    const locale = formData.get('locale') as string;
    const domain =
      locale === 'cy' || window.location.host.includes('walesrecycles.org.uk')
        ? 'locator.walesrecycles.org.uk'
        : 'locator.recyclenow.com';
    const url = new URL(`https://${domain}${route}`);
    url.searchParams.set('locale', locale);
    // Open the standalone app in a new tab
    window.open(url, '_blank').focus();
    // Send the user back to the same page on the current tab
    return redirect(path);
  }

  return redirect(route);
}

export async function homeRecyclingStartAction({
  request,
}: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const response = await handleRedirect(formData, '/home');
    return response;
  } catch (error) {
    handleError(error);
  }
}

export async function materialStartAction({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const searchParams = mapSearchParams(
      ['materials', 'category', 'search'],
      formData,
    );

    const response = await handleRedirect(
      formData,
      `/material?${searchParams.toString()}`,
    );
    return response;
  } catch (error) {
    handleError(error);
  }
}

export default async function startAction({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const response = await handleRedirect(formData);
    return response;
  } catch (error) {
    handleError(error);
  }
}
