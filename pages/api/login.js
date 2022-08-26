import { magicAdmin } from "../../lib/magic.js";
import jwt from "jsonwebtoken";
//import { User } from "../../lib/db/hasura.js";
import { isNewUser } from "../../lib/db/hasura.js";

export default async function login(req, res) {
  if (req.method === "POST") {
    try {
      const auth = req.headers.authorization;
      // const abc = req.headers.authorization;
      // console.log("abc", { token: abc.substr(7) });
      const didToken = auth ? auth.substr(7) : "";
      console.log({ didToken });
      const metadata = await magicAdmin.users.getMetadataByToken(didToken);
      console.log("data is", { metadata });
      const newdata = {
        issuer: metadata.issuer,
        publicAddress: metadata.publicAddress,
        email: metadata.email,
      };
      console.log({ newdata });
      const token = jwt.sign(
        {
          ...metadata,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
          "https://hasura.io/jwt/claims": {
            "x-hasura-allowed-roles": ["user", "admin"],
            "x-hasura-default-role": "user",
            "x-hasura-user-id": `${metadata.issuer}`,
          },
        },
        "thisisasecretthisisasecret123445"
      );
      console.log("generate", token);
      const isNewUserQuery = await isNewUser(token);
      res.send({ done: true, isNewUserQuery });
    } catch (error) {
      console.error("error is", error);
      res.status(500).send({ done: false });
    }
  } else {
    res.send({ done: false });
  }
  // if (req.method === "POST") {
  //   try {
  //     res.send({ done: true });
  //   } catch (error) {
  //     console.error("something went wrong", error);
  //     res.status(500).send({ done: false });
  //   }
  // }
}
// export default async function login(req, res) {
//   if (req.method === "POST") {
//     try {
//       const auth = req.headers.authorization;
//       const didToken = auth ? auth.substr(7) : "";
//       console.log({ auth }, { didToken });
//       const metadata = await magicAdmin.users.getMetadataByToken(didToken);
//       console.log({ metadata });
//       res.send({ done: true });
//     } catch (error) {
//       console.log(error);
//       res.status(500).send({ done: false });
//     }
//   } else {
//     res.send({ done: false });
//   }
// }
