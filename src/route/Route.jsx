import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import Home from '../pages/Home';
import Root from '../pages/Root';
import NotFound from '../pages/NotFound';


const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children:[
        {
            index: true,
            Component: Home,
        },
        {
            path: "*",
            Component: NotFound
        }
    ]
  }
]);

export default router;