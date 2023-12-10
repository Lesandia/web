import { useContext, useReducer, createContext, useEffect } from "react";
import AppReducer from "./AppReducer";

const initialState = {
  transactions: [],
};

export const Context = createContext(initialState);

export const useGlobalState = () => {
  const context = useContext(Context);
  if (!context)
    throw new Error("useGlobalState must be used within a GlobalState");
  return context;
};

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState, () => {
    const localData = localStorage.getItem("transactions"); //esta acumulando las transacciones en el localStorage
    return localData ? JSON.parse(localData) : initialState;
  });

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(state));
  }, [state]);

  const deleteTransaction = (id) =>
    dispatch({
      type: "DELETE_TRANSACTION",
      payload: id,
    });

  const addTransaction = (transaction) =>
    dispatch({
      type: "ADD_TRANSACTION",
      payload: transaction,
    });

  return (
    <Context.Provider
      value={{
        transactions: state.transactions,
        deleteTransaction,
        addTransaction,
      }}
    >
      {children}
    </Context.Provider>
  );
};




// import React, { useContext, useReducer, createContext, useEffect } from "react";
// import axios from "axios";
// import AppReducer from "./AppReducer";

// const initialState = {
//   transactions: [],
// };

// export const Context = createContext(initialState);

// export const useGlobalState = () => {
//   const context = useContext(Context);
//   if (!context)
//     throw new Error("useGlobalState must be used within a GlobalState");
//   return context;
// };

// export const GlobalProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(AppReducer, initialState);

//   useEffect(() => {
//     axios.get("http://localhost:3000/api/transactions")
//       .then((response) => {
//         dispatch({
//           type: "SET_TRANSACTIONS",
//           payload: response.data,
//         });
//       })
//       .catch((error) => {
//         console.error("Error fetching transactions:", error);
//       });
//   }, []);

//   const deleteTransaction = (id) => {
//     axios.delete(`http://localhost:3000/api/transactions/${id}`)
//       .then(() => {
//         dispatch({
//           type: "DELETE_TRANSACTION",
//           payload: id,
//         });
//       })
//       .catch((error) => {
//         console.error("Error deleting transaction:", error);
//       });
//   };

//   const addTransaction = (transaction) => {
//     axios.post("http://localhost:3000/api/transactions", transaction)
//       .then((response) => {
//         dispatch({
//           type: "ADD_TRANSACTION",
//           payload: response.data,
//         });
//       })
//       .catch((error) => {
//         console.error("Error adding transaction:", error);
//       });
//   };

//   return (
//     <Context.Provider
//       value={{
//         transactions: state.transactions,
//         deleteTransaction,
//         addTransaction,
//       }}
//     >
//       {children}
//     </Context.Provider>
//   );
// };
