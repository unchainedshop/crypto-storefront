export default [
  /* GraphQL */ `

  extend type Mutation {
    changeCartCurrency(currency: String!): Order!

  }

  `,
];
