import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./app/App.css";
import { Provider } from "react-redux";
import { store } from "./app/store.jsx";
import { RouterProvider } from "react-router";
import { router } from "./app/routes/routes.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />;
    </QueryClientProvider>
  </Provider>,
);
