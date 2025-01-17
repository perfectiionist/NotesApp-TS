import React, { FC } from "react";
import NoteForm from "./NoteForm";
import { NoteData, Tag } from "./App";
import { useNote } from "./NoteLayout";

type EditNoteProps = {
  onSubmit: (id: string, data: NoteData) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
};

const EditNote: FC<EditNoteProps> = ({ onSubmit, onAddTag, availableTags }) => {
  const note = useNote();
  return (
    <>
      <h1 className="mb-4">Edit Note</h1>
      {note && (
        <NoteForm
          title={note.title}
          markdown={note.markdown}
          tags={note.tags}
          onSubmit={(data) => onSubmit(note.id, data)}
          onAddTag={onAddTag}
          availableTags={availableTags}
        />
      )}
    </>
  );
};

export default EditNote;
