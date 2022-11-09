import {
  unstable_createFileUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import {Form}  from "@remix-run/react";

// export const fileUploadHandler = unstable_createFileUploadHandler({
//   directory: "./public/uploads",
//   file: ({ filename }) => filename,
// });

// export async function action({ request }) {
//   const formData = await unstable_parseMultipartFormData(
//     request,
//     fileUploadHandler
//   );
//   console.log(formData.get("upload")); // will return the filename

//   return {};
// }

export default function UploadImg() {
  return (
    <Form method="post" encType="multipart/form-data">
      <input type="file" name="upload" />
      <button type="submit">upload</button>
    </Form>
  );
}
