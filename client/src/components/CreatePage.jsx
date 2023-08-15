import React from 'react';
import { Navigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

function CreatePage() {
  const newDocumentId = uuid();
  return <Navigate to={`/docs/${newDocumentId}`} replace />;
}

export default CreatePage;
