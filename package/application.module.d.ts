import { MiddlewareConsumer, NestModule } from "@nestjs/common";
import { GraphQLFactory } from "@nestjs/graphql";
export declare class ApplicationModule implements NestModule {
    private readonly graphQLFactory;
    constructor(graphQLFactory: GraphQLFactory);
    configure(consumer: MiddlewareConsumer): void;
}
