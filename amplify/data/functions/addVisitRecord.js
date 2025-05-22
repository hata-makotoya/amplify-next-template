import * as ddb from "@aws-appsync/utils/dynamodb";

export function request(ctx) {
    return ddb.put({
        key: { visitRecordId: ctx.args.visitRecordId },
        item: {
            ...ctx.args,
            version: 1,
            isDeleted: false,
        },
    });
}

export function response(ctx) {
    return ctx.result;
}
