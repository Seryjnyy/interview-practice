import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { getNoteIDsForQuestion, saveNoteForQuestion } from "@/lib/noteServices";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import Note from "./questions/Note";

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
    if (note.trim().length == 0) return;

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
    setNotes(getNoteIDsForQuestion(question.id));
  }, [question.id]);

  const onCreateNote = () => {
    setNotes(getNoteIDsForQuestion(question.id));
  };

  const onDeleteNote = () => {
    setNotes(getNoteIDsForQuestion(question.id));
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
                      key={noteID}
                      questionID={question.id}
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
