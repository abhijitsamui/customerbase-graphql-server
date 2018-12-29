const axios = require("axios");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = require("graphql");

//Hardcoded data

// const customers = [
//   { id: "1", name: "John Doe", email: "john@gmail.com", age: 35 },
//   { id: "2", name: "Tanup Ghosh", email: "tanup@gmail.com", age: 33 },
//   { id: "3", name: "Abhijit Samui", email: "abhi@gmail.com", age: 32 },
//   { id: "4", name: "Pankaj Garg", email: "pankaj@gmail.com", age: 34 },
//   { id: "5", name: "Jignesh Patel", email: "jiggy@gmail.com", age: 29 }
// ];
//Customer Type

const CustomerType = new GraphQLObjectType({
  name: "Customer",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    age: { type: GraphQLInt }
  })
});

//Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    customer: {
      type: CustomerType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(parent, args) {
        return axios
          .get("http://localhost:3000/customers/" + args.id)
          .then(res => res.data);

        // for (let i = 0; i < customers.length; i++) {
        //   if (customers[i].id == args.id) {
        //     return customers[i];
        //   }
        // }
      }
    },
    customers: {
      type: new GraphQLList(CustomerType),
      resolve(parent, args) {
        return axios
          .get("http://localhost:3000/customers/")
          .then(res => res.data);
      }
    }
  }
});

//Mutations
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addCustomer: {
      type: CustomerType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args) {
        return axios
          .post("http://localhost:3000/customers/", {
            name: args.name,
            email: args.email,
            age: args.age
          })
          .then(res => res.data);
      }
    },
    deleteCustomer: {
      type: CustomerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        return axios
          .delete("http://localhost:3000/customers/" + args.id)
          .then(res => res.data);
      }
    },
    editCustomer: {
      type: CustomerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: GraphQLInt }
      },
      resolve(parent, args) {
        return axios
          .patch("http://localhost:3000/customers/" + args.id, args)
          .then(res => res.data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});
