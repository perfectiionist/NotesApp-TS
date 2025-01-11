import React, { FC } from "react";
import { useNote } from "./NoteLayout";
import { Row, Col, Stack, Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";

type NoteProps = {
  onDelete: (id: string) => void;
};

const Note: FC<NoteProps> = ({ onDelete }) => {
  const note = useNote();
  const navigate = useNavigate();
  const handleDelete = () => {
    if (note) {
      onDelete(note.id);
      navigate("/");
      alert("The note was successfully deleted");
    }
  };
  return (
    <>
      <Row className="align-items-center mb-4">
        {note && (
          <Col>
            <h1>{note.title}</h1>
            {note.tags.length > 0 && (
              <Stack gap={1} direction="horizontal" className="flex-wrap">
                {note.tags.map((tag) => (
                  <Badge className="text-truncate" key={tag.id}>
                    {tag.lable}
                  </Badge>
                ))}
              </Stack>
            )}
          </Col>
        )}
        <Col xs="auto">
          <Stack gap={2} direction="horizontal" style={{ marginTop: 15 }}>
            {note && (
              <Link to={`/${note.id}/edit`}>
                <Button variant="primary">Edit</Button>
              </Link>
            )}

            <Button variant="outline-danger" onClick={handleDelete}>
              Delete
            </Button>
            <Link to="/">
              <Button variant="outline-secondary">Back</Button>
            </Link>
          </Stack>
        </Col>
      </Row>
      {note && <ReactMarkdown>{note.markdown}</ReactMarkdown>}
    </>
  );
};

export default Note;
