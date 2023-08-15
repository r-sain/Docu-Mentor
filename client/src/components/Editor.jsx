import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { io } from 'socket.io-client';
import $ from 'jquery';
import { Link, useNavigate, useParams, withRouter } from 'react-router-dom';
import { useURLContext } from '../URLContext'; // Import the URLContext

import styled from '@emotion/styled';
import './editor.css';
import { FcDocument } from 'react-icons/fc';
import SimpleModal from './SimpleModal';
const Component = styled.div`
  background-color: #ededed;
`;

function Editor() {
  const { updateURL } = useURLContext(); // Access the updateURL function from context

  const [quill, setQuill] = useState();
  const [socket, setSocket] = useState();
  const { id } = useParams();

  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block'],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    [{ direction: 'rtl' }], // text direction

    [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ['clean'], // remove formatting button
  ];

  useEffect(() => {
    const quillServer = new Quill('#container', {
      theme: 'snow',
      modules: { toolbar: toolbarOptions },
    });
    quillServer.disable();
    quillServer.setText('Loading the document...');
    setQuill(quillServer);
  }, []);

  useEffect(() => {
    const socketServer = io('http://localhost:9000');
    setSocket(socketServer);

    return () => {
      socketServer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket === null || quill === null) return;

    const handleChange = (delta, oldData, source) => {
      if (source !== 'user') return;

      socket.emit('send-changes', delta);
    };

    quill && quill.on('text-change', handleChange);

    return () => {
      quill && quill.off('text-change', handleChange);
    };
  }, [quill, socket]);

  useEffect(() => {
    if (socket === null || quill === null) return;

    const handleChange = delta => {
      quill.updateContents(delta);
    };

    socket && socket.on('receive-changes', handleChange);

    return () => {
      socket && socket.off('receive-changes', handleChange);
    };
  }, [quill, socket]);

  useEffect(() => {
    if (socket === null || quill === null) return;

    socket &&
      socket.once('load-document', document => {
        quill && quill.setContents(document);
        quill && quill.enable();
      });

    socket && socket.emit('get-document', id);
  }, [quill, socket, id]);

  useEffect(() => {
    if (socket === null || quill === null) return;

    const interval = setInterval(() => {
      socket && socket.emit('save-document', quill.getContents());
      console.log('false');
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [quill, socket]);

  // ************************************checking if editor has content********************
  const [hasContent, setHasContent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [shouldNavigate, setShouldNavigate] = useState(false);

  useEffect(() => {
    if (quill) {
      const handleChange = () => {
        const newHasContent = quill.getLength() > 1;
        setHasContent(newHasContent);
      };

      quill.on('text-change', handleChange);

      return () => {
        quill.off('text-change', handleChange);
      };
    }
  }, [quill]);

  // **************************getting current window url**************
  const navigate = useNavigate();
  const currentUrl = window.location.href;
  const handleHeaderClick = () => {
    if (hasContent) {
      setShowModal(true);
    } else {
      navigateWithoutSaving();
    }
  };

  const handleYes = () => {
    updateURL(currentUrl, false); // Don't update localStorage for this call
    setHasContent(true);
    setShowModal(false);
    navigate('/');
  };

  const handleNo = () => {
    setShouldNavigate(true);
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (shouldNavigate) {
      navigateWithoutSaving();
    }
  }, [shouldNavigate]);

  const navigateWithoutSaving = () => {
    // Navigate to the homepage without saving
    window.location.href = '/';
  };

  return (
    <div id="editor">
      <div className="header" onClick={handleHeaderClick}>
        <div className="logo">
          <FcDocument size={40} />
        </div>
        <div className="appname">Docu Mentor</div>
      </div>
      <Component>
        <Box className="container" id="container"></Box>
      </Component>
      <SimpleModal
        open={showModal}
        onClose={handleCloseModal}
        onNo={handleNo}
        onYes={handleYes}
      />
    </div>
  );
}

export default Editor;
