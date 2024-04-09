import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDownIcon,
  Cross1Icon,
  Pencil1Icon,
} from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { v4 as uuidv4 } from "uuid";
import { Badge } from "@/components/ui/badge";
import {
  deleteNote,
  getNote,
  getNotesForQuestion,
  saveNoteForQuestion,
  updateNote,
} from "@/lib/noteServices";

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

const CreateNote = ({
  questionID,
  onSuccess,
}: {
  questionID: string;
  onSuccess: () => void;
}) => {
  const [note, setNote] = useState("");

  // TODO : checks
  const handleSaveNote = () => {
    // const id = uuidv4();
    // localStorage.setItem(id, note);

    // const res = getNotesForQuestion(questionID)
    // res.push(id)
    // localStorage.setItem(`notes-for-id${questionID}`, JSON.stringify(res));
    saveNoteForQuestion(questionID, note);

    setNote("");
    onSuccess();
  };

  return (
    <div className="space-y-2">
      <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
      <Button onClick={handleSaveNote}>Save</Button>
    </div>
  );
};

const Note = ({
  id,
  onDeleteNote,
  questionID,
}: {
  id: string;
  questionID: string;
  onDeleteNote: () => void;
}) => {
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
    <div className="border p-2 rounded-md relative group w-[98%]">
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
};

export default function NotesModal({
  question,
  triggerText,
  triggerVariant,
}: {
  question: { id: string; val: string };
  triggerText: string;
  triggerVariant: "outline" | "ghost";
}) {
  const [notes, setNotes] = useState<string[]>([]);

  useEffect(() => {
    setNotes(getNotesForQuestion(question.id));
  }, []);

  const onCreateNote = () => {
    setNotes(getNotesForQuestion(question.id));
  };

  const onDeleteNote = () => {
    setNotes(getNotesForQuestion(question.id));
  };

  return (
    <Dialog>
      <DialogTrigger
        className={cn(
          "relative",
          buttonVariants({ variant: triggerVariant }),
          "pr-4"
        )}
      >
        {triggerText}
        {notes.length > 0 ? (
          <Badge
            variant="outline"
            className="absolute top-0 right-0 p-[2px] rounded-sm backdrop-blur-sm"
          >
            {notes.length}
          </Badge>
        ) : (
          <></>
        )}
      </DialogTrigger>
      <DialogContent className="md:min-w-[70%] h-[98%] md:h-[65%] flex flex-col">
        <DialogHeader>
          <DialogTitle>{question.val}</DialogTitle>
          <DialogDescription>
            Here are your notes for this question.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Tabs defaultValue="view-notes">
            <TabsList>
              <TabsTrigger value="view-notes" className="space-x-1">
                <span>View notes</span>
                <Badge variant="outline" className="p-[2px]">
                  {notes.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="create-note">Create note</TabsTrigger>
            </TabsList>
            <TabsContent value="view-notes">
              <ScrollArea className="h-[30rem]">
                <div className="flex flex-col gap-2">
                  {notes.map((noteID) => (
                    <Note
                      id={noteID}
                      questionID={question.id}
                      key={noteID}
                      onDeleteNote={onDeleteNote}
                    />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="create-note">
              <CreateNote questionID={question.id} onSuccess={onCreateNote} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
