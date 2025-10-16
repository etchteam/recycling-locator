import { ActionFunctionArgs } from 'react-router';

import materialSearchRedirect from '@/lib/materialSearchRedirect';

export default async function postcodeAction({
  request,
  params,
}: ActionFunctionArgs) {
  const formData = await request.formData();
  return await materialSearchRedirect(formData, params.postcode, 'material');
}
