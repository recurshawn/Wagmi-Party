"use client";

import Party from "@/components/party";
import { Button } from "@/components/ui/button";

import {
    useDataMessage,
  useLocalAudio,
  useLocalPeer,
  usePeerIds,
  useRemoteAudio,
  useRoom,
} from "@huddle01/react/hooks";
import { Role } from "@huddle01/server-sdk/auth";
import axios from "axios";
import { FC, useEffect, useRef, useState } from "react";

interface RemotePeerProps {
  peerId: string;
}

const RemotePeer: FC<RemotePeerProps & { volume: number }> = ({
  peerId,
  volume,
}) => {
  const { stream, state } = useRemoteAudio({ peerId });
  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    if (stream && audioRef.current && state === "playable") {
      audioRef.current.srcObject = stream;
      audioRef.current.play();
    }
  }, [stream, state]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  return (
    <div>
      <audio ref={audioRef} autoPlay></audio>
    </div>
  );
};

interface coords {
    x: number, y: number
}
export default function Room() {
    const [coords, getCoords] = useState({x: 300, y: 200})
    const [peers, setPeers] = useState<{[key: string]: coords}>([])
    
    const {
        localPeerId
       
      } = useLocalPeer<{name: string}>({
       
      });

  const [isJoined, setIsJoined] = useState(false);

  const { joinRoom, leaveRoom } = useRoom({
    onJoin: (room) => {
      setIsJoined(true);
      console.log("Joined the room", room);
    },
    onLeave: () => {
      console.log("Left the room");
      setIsJoined(false);
    },
  });

  const sendMessage = () => {
    sendData({
      to: '*',
      payload: JSON.stringify({...coords}),
      label: "move"
    });
  };

  const dataMessage = useDataMessage({ onMessage: (payload, from, label) => {
	console.log("Received a message!");
	console.log("Message: ", payload);
    console.log("Sender: ", from);
    console.log("Label: ", label)
    if(label === 'move') {
        setPeers(prev => {
            if(localPeerId === from)
                return prev
            const old = prev
            const parsedCoords = JSON.parse(payload)
            old[from] = parsedCoords; //JSON.parse(payload)
            return old
        })
    };
    // your code here
}});

  useEffect(() => {sendMessage()}, [coords])

  const { localStream, enableAudio, disableAudio, isAudioOn } = useLocalAudio();

  useEffect(() => {
    console.log("hi");
    (async () => {
      const token = (
        await axios.get(
          `/api/generateToken?roomId=${process.env.NEXT_PUBLIC_ROOMID}`
        )
      ).data;
      console.log({ token });
      joinRoom({
        roomId: process.env.NEXT_PUBLIC_ROOMID as string,
        token: token,
      });
    })();
  }, []);

  const { peerIds } = usePeerIds({ roles: [Role.SPEAKER] });

  useEffect(() => {
    console.log(peerIds);
  }, [peerIds]);

  
  const {
    sendData
  } = useDataMessage();

  
  return (
    <>
      Welcome to the Party
      <br />
      <Button
        onClick={() => {
          if (isAudioOn) {
            disableAudio();
          } else {
            enableAudio();
          }
        }}
      >
        {isAudioOn ? "Mute" : "Unmute"}
      </Button>
      {peerIds.map((peerId) => {
        return <RemotePeer key={peerId} peerId={peerId} volume={Math.sqrt(Math.pow(peers[peerId].x - coords.x, 2) + Math.pow(peers[peerId].y - coords.y, 2)) > 40 ? 0 : 0.8} />;
      })}
      <br />
      <Party getCoords={getCoords} peers={peers}/>
      {'X:' + coords.x + ' Y:' + coords.y}
      <br />
      {isJoined && <Button onClick={leaveRoom}>Leave Party</Button>}
    </>
  );
}
