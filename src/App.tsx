import React, { useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import NewNote from "./NewNote";
import { useLocalStorage } from "./useLocalStorage";
import { v4 as uuidV4 } from "uuid";
import NoteList from "./NoteList";
import NoteLayout from "./NoteLayout";
import Note from "./Note";
import EditNote from "./EditNote";

export type RawNote = {
  id: string;
} & RawNoteData;

export type Note = {
  id: string;
} & NoteData;

export type NoteData = {
  title: string;
  markdown: string;
  tags: Tag[];
};

export type RawNoteData = {
  title: string;
  markdown: string;
  tagIds: string[];
};

export type Tag = {
  id: string;
  lable: string;
};

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);

  const notesWithTags = useMemo(() => {
    return notes.map((note) => {
      return {
        ...note,
        tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
      };
    });
  }, [notes, tags]);

  const createNote = ({ tags, ...data }: NoteData) => {
    setNotes((prev) => {
      return [
        ...prev,
        { ...data, id: uuidV4(), tagIds: tags.map((tag) => tag.id) },
      ];
    });
  };

  const addTag = (tag: Tag) => {
    setTags((prev) => [...prev, tag]);
  };
  const onUpdateTag = (id: string, { tags, ...data }: NoteData) => {
    setNotes((prev) => {
      return prev.map((note) => {
        if (note.id === id) {
          return {
            ...note,
            ...data,
            tagIds: tags.map((tag) => tag.id),
          };
        } else {
          return note;
        }
      });
    });
  };

  const onDeleteNote = (id: string) => {
    setNotes((prev) => {
      return prev.filter((note) => note.id !== id);
    });
  };

  const updateTags = (id: string, lable: string) => {
    setTags((prev) => {
      return prev.map((tag) => {
        if (tag.id === id) {
          return { ...tag, lable };
        } else {
          return tag;
        }
      });
    });
  };
  const deleteTags = (id: string) => {
    setTags((prev) => {
      return prev.filter((tag) => tag.id !== id);
    });
  };
  return (
    <Container className="my-4">
      <Routes>
        <Route
          path="/"
          element={
            <NoteList
              availableTags={tags}
              notes={notesWithTags}
              updateTags={updateTags}
              deleteTag={deleteTags}
            />
          }
        />
        <Route
          path="new"
          element={
            <NewNote
              onSubmit={createNote}
              onAddTag={addTag}
              availableTags={tags}
            />
          }
        />
        <Route path="/:id" element={<NoteLayout notes={notesWithTags} />}>
          <Route index element={<Note onDelete={onDeleteNote} />} />
          <Route
            path="edit"
            element={
              <EditNote
                onSubmit={onUpdateTag}
                onAddTag={addTag}
                availableTags={tags}
              />
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  );
}

export default App;
