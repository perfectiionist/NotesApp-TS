import { FC, useMemo, useState } from "react";
import { Button, Col, Form, Row, Stack, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactSelect from "react-select";
import { Note, Tag } from "./App";
import NoteCard from "./NoteCard";

type NoteListProps = {
  availableTags: Tag[];
  notes: Note[];
  updateTags: (id: string, lable: string) => void;
  deleteTag: (id: string) => void;
};

const NoteList: FC<NoteListProps> = ({
  availableTags,
  notes,
  updateTags,
  deleteTag,
}) => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [title, setTitle] = useState<string>("");
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      return (
        (title === "" ||
          note.title.toLowerCase().includes(title.toLowerCase())) &&
        (selectedTags.length === 0 ||
          selectedTags.every((tag) =>
            note.tags.some((noteTag) => noteTag.id === tag.id)
          ))
      );
    });
  }, [title, selectedTags, notes]);
  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <h1>Notes</h1>
        </Col>
        <Col xs="auto">
          <Stack gap={2} direction="horizontal" style={{ marginTop: 15 }}>
            <Link to="/new">
              <Button variant="primary">Create</Button>
            </Link>
            <Button
              variant="outline-secondary"
              onClick={() => setEditModalIsOpen(true)}
            >
              Edit Tags
            </Button>
          </Stack>
        </Col>
      </Row>
      <Form>
        <Row className="mb-4">
          <Col>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <ReactSelect
                value={selectedTags.map((tag) => {
                  return { label: tag.lable, value: tag.id };
                })}
                options={availableTags.map((tag) => {
                  return { label: tag.lable, value: tag.id };
                })}
                onChange={(tags) => {
                  setSelectedTags(
                    tags.map((tag) => {
                      return { lable: tag.label, id: tag.value };
                    })
                  );
                }}
                isMulti
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>
      <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <Col key={note.id}>
              <NoteCard id={note.id} title={note.title} tags={note.tags} />
            </Col>
          ))
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100vw",
              flexDirection: "column",
            }}
          >
            <span style={{ fontSize: 28 }}>😔</span>
            <p style={{ fontSize: 24 }}>There are no notes available</p>
          </div>
        )}
      </Row>
      <EditTagsModal
        updateTags={updateTags}
        deleteTag={deleteTag}
        show={editModalIsOpen}
        handleHide={() => setEditModalIsOpen(false)}
        availableTags={availableTags}
      />
    </>
  );
};

export default NoteList;

type EditTagsModalProps = {
  availableTags: Tag[];
  show: boolean;
  handleHide: () => void;
  updateTags: (id: string, lable: string) => void;
  deleteTag: (id: string) => void;
};

function EditTagsModal({
  availableTags,
  show,
  handleHide,
  updateTags,
  deleteTag,
}: EditTagsModalProps) {
  return (
    <Modal show={show} onHide={handleHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Tags</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Stack gap={2}>
            {availableTags.map((tag) => (
              <Row key={tag.id}>
                <Col>
                  <Form.Control
                    type="text"
                    value={tag.lable}
                    onChange={(e) => updateTags(tag.id, e.target.value)}
                  />
                </Col>
                <Col xs="auto">
                  <Button
                    variant="outline-danger"
                    onClick={() => deleteTag(tag.id)}
                  >
                    &times;
                  </Button>
                </Col>
              </Row>
            ))}
          </Stack>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
