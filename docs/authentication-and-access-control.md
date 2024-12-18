# **Authentication and Access Control**

Content Kitty uses cookie authentication. When you login, a session is created, its ID is set as a cookie, and you have access to pages that require authentication by default. You also have access to data related to your session via the context object which you can specify which fields should be included.

```ts
{
    authSession: {
        initFirstAuth: {
            email: "admin@content-kitty.com",
            password: "1234",
        },

        // default: "*"
        sessionData: ["id", "email"],
    }
}
```

## **Access Control**

Inside a table's **beforeOperation** hooks (refer to [**Hooks**](https://github.com/serhankileci/content-kitty/blob/main/docs/hooks.md)), you can return a boolean to allow or deny access to an operation. Here is a hook that employs role-based and rule-based permissions:

```ts
{
    hooks: {
        beforeOperation: [
            ({ context, operation, existingData, inputData }) => {
                // cause side-effect

                const user_type = ctx.sessionData?.user_type;
                const isUserAndReadOp = user_type === "user" && operation === "read";
                const isAdmin = user_type === "admin";

                return isUserAndReadOp || isAdmin;
            },
        ]
    }
}
```
