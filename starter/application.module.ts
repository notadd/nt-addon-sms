import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { GraphQLFactory, GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { graphiqlExpress, graphqlExpress } from "apollo-server-express";

import { SmsModule } from "../src/sms.module";

@Module({
  imports: [
    GraphQLModule,
    TypeOrmModule.forRoot(),
    SmsModule
  ]
})
export class ApplicationModule implements NestModule {
  constructor(private readonly graphQLFactory: GraphQLFactory) {
  }

  configure(consumer: MiddlewareConsumer) {
    const typeDefs = this.graphQLFactory.mergeTypesByPaths("./**/*.types.graphql");
    const schema = this.graphQLFactory.createSchema({ typeDefs });

    consumer
      .apply(graphiqlExpress({ endpointURL: "/graphql" }))
      .forRoutes("/graphiql")
      .apply(graphqlExpress(req => ({ schema, rootValue: req })))
      .forRoutes("/graphql");
  }
}
