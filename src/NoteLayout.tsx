import React, { FC } from "react";
import { Note } from "./App";
import {
  Outlet,
  useOutletContext,
  useParams,
  Navigate,
} from "react-router-dom";

type NoteLayoutProps = {
  notes: Note[];
};

export function useNote() {
  return useOutletContext<Note | undefined>();
}

const NoteLayout: FC<NoteLayoutProps> = ({ notes }) => {
  const { id } = useParams();
  const note = notes.find((n) => n.id === id);

  if (note === undefined) {
    return <Navigate to="/" replace />;
  }

  return <Outlet context={note} />;
};

export default NoteLayout;
