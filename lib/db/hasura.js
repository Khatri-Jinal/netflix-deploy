export async function isNewUser(token) {
  const operationsDoc = `
  query MyQuery {
    users(where: {issuer: {_eq: "did:ethr:0xeb9FA8C748844af9c800321f96C0BEE748988368"}}) {
      email
      id
      issuer
    }
  }
  `;

  const response = await queryHasuraGraphQL(
    operationsDoc,
    "MyQuery",
    {},
    token
  );
  console.log("response is", { response });
  return response?.users?.length === 0;
}
async function queryHasuraGraphQL(
  operationsDoc,
  operationName,
  variables,
  token
) {
  const result = await fetch(
    //"https://intense-viper-72.hasura.app/v1/graphql"
    process.env.NEXT_PUBLIC_HASURA_ADMIN_URL,
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        query: operationsDoc,
        variables: variables,
        operationName: operationName,
      }),
    }
  );

  return await result.json();
}

// const operationsDoc = `
//   query MyQuery {
//     users(where: {issuer: {_eq: "did:ethr:0xeb9FA8C748844af9c800321f96C0BEE748988368"}}) {
//       email
//       id
//       issuer
//     }
//   }
// `;

// function fetchMyQuery() {
//   return queryHasuraGraphQL(
//     operationsDoc,
//     "MyQuery",
//     {},
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3N1ZXIiOiJkaWQ6ZXRocjoweGViOUZBOEM3NDg4NDRhZjljODAwMzIxZjk2QzBCRUU3NDg5ODgzNjgiLCJwdWJsaWNBZGRyZXNzIjoiMHhlYjlGQThDNzQ4ODQ0YWY5YzgwMDMyMWY5NkMwQkVFNzQ4OTg4MzY4IiwiZW1haWwiOiJqaW5hbC5raGF0cmlAc2ltZm9ybXNvbHV0aW9ucy5jb20iLCJvYXV0aFByb3ZpZGVyIjpudWxsLCJwaG9uZU51bWJlciI6bnVsbCwiaWF0IjoxNjYxMzQ0ODUwLCJleHAiOjE2NjE5NDk2NTAsImh0dHBzOi8vaGFzdXJhLmlvL2p3dC9jbGFpbXMiOnsieC1oYXN1cmEtYWxsb3dlZC1yb2xlcyI6WyJ1c2VyIiwiYWRtaW4iXSwieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoidXNlciIsIngtaGFzdXJhLXVzZXItaWQiOiJkaWQ6ZXRocjoweGViOUZBOEM3NDg4NDRhZjljODAwMzIxZjk2QzBCRUU3NDg5ODgzNjgifX0.OtgMQ1bcwF36gcTapvbLnWOmya0jhtmAHzsxQMtEkoY"
//   );
// }

export async function startFetchMyQuery() {
  const { errors, data } = await fetchMyQuery();

  if (errors) {
    // handle those errors like a pro
    console.error(errors);
  }

  // do something great with this precious data
  console.log("data is", data);
}
