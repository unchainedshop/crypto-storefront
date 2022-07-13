export default [
  /* GraphQL */ `

  extend type Price {
    gweiAmount: String
  }

  extend type Mutation {
    changeCartCurrency(currency: String!): Order!

  }

  `,
];
