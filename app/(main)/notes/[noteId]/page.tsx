"use client";
import Editor from "@/components/Editor"
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc, DocumentData, DocumentReference, Timestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { Toolbar } from "./_components/Toolbar";
import { Cover } from "./_components/Cover";
import { useEffect } from "react";

interface RoomDocument extends DocumentData {
  title: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  role: "owner" | "editor";
  roomId: string;
  userId: string;
  parentNoteId: string | null;
  archived: boolean;
  icon: string;
  coverImage: string;
  quickAccess: boolean;
}

function Page({params: {noteId}}: {params: {noteId: string}}) {
  const { user } = useUser();
  const [data] = useDocumentData<RoomDocument>(doc(db, "users", user?.emailAddresses[0].toString()!, "rooms", noteId) as DocumentReference<RoomDocument>); // eslint-disable-line @typescript-eslint/no-non-null-asserted-optional-chain
  
  useEffect(() => {
    if (data?.title) {
      document.title = data.title + " | NotionX";
    }
  }, [data]);

  return (
    <div className="pb-40 mt-14">
      <Cover url={data?.coverImage} showAvatar={true}/>
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto h-full">
        <Toolbar noteId={noteId} title={data?.title!} icon={data?.icon!} coverUrl={data?.coverImage!} /> {/* eslint-disable-line @typescript-eslint/no-non-null-asserted-optional-chain */}
        <Editor noteId={noteId} />
      </div>
    </div>
  )
}
export default Page