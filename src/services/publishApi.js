import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const publishApi = createApi({
  reducerPath: 'publishApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL
  }),
  tagTypes: ['Publish'],

  endpoints: (builder) => ({

 adminUnpublishDocumentList: builder.query({
      query: () => ({
        url: `adminunpublish_document_list`,
        method: 'GET',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          "Authorization": `Bearer ${Cookies.get("token")}`
        }
      }),
      providesTags: ['Publish']
    }),
 
    
    adminDocumentPublish: builder.mutation({
      query: (id) => {
        return {
          url: `admin_document_publish/${id}`,
          method: 'POST',
          headers: {
            "Authorization": `Bearer ${Cookies.get("token")}`
          }

        };
      },
      invalidatesTags: ['Publish']
    }),

    deleteUnpublishDocument: builder.mutation({
        query: (id) => ({
          url: `document/${id}`,
          method: 'DELETE',
          headers: {
            "Authorization": `Bearer ${Cookies.get("token")}`
          }
        }),
        invalidatesTags: ['Publish']
      }),
 

      unpublishDocument: builder.query({
        query: (id) => ({
          url: `document/${id}`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            "Authorization": `Bearer ${Cookies.get("token")}`
          }
        }),
        // invalidatesTags: ['DocumentData'],
        invalidatesTags: ['Publish']
      }),
      

  
  })
});

export const {
    useAdminUnpublishDocumentListQuery,
    useAdminDocumentPublishMutation,
    useDeleteUnpublishDocumentMutation,
    useUnpublishDocumentQuery
    
} = publishApi;
