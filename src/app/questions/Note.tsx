import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { deleteNote, getNote, updateNote } from "@/lib/noteServices";
import { Cross1Icon, Pencil1Icon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

const Edit = ({
  val,
  onSave,
  onCancel,
}: {
  val: string;
  onSave: (newVal: string) => void;
  onCancel: () => void;
}) => {
  const [note, setNote] = useState(val);

  return (
    <div>
      <Textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="min-h-[8rem]"
      />
      <div className="pt-4 space-x-2">
        <Button onClick={() => onSave(note)}>Save</Button>
        <Button onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
};

export default function Note({
  id,
  onDeleteNote,
  questionID,
}: {
  id: string;
  questionID: string;
  onDeleteNote: () => void;
}) {
  const [edit, setEdit] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    const res = getNote(id);

    if (res) {
      setNote(res.val);
    }
  });

  const handleEditCancel = () => {
    setEdit(false);
  };

  const handleEditSave = (newVal: string) => {
    updateNote(id, newVal);

    const res = getNote(id);
    if (res) {
      setNote(res.val);
    }
    setEdit(false);
  };

  const handleDelete = () => {
    deleteNote(questionID, id);
    onDeleteNote();
  };

  return (
    <div className="border p-2 rounded-md relative group w-[98%]" key={id}>
      {edit ? (
        <Edit val={note} onCancel={handleEditCancel} onSave={handleEditSave} />
      ) : (
        <div className="py-4">
          <div>{note}</div>
          <div>
            <div className="pt-3 flex justify-end opacity-90 px-2 space-x-2 lg:group-hover:block lg:hidden lg:absolute lg:right-2 lg:bottom-2">
              <Button onClick={() => setEdit((prev) => !prev)}>
                <Pencil1Icon />
              </Button>
              <Button onClick={handleDelete}>
                <Cross1Icon />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
