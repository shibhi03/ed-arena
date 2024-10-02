// import axios from "axios";
import { useEffect, useState } from "react";
import ChapterList from "./ChapterListView";
import "./Styles/videoPlayer.css";

export default function VideosPlayer() {
  const [videosList, setVideosList] = useState([]);
  const [chaptersList, setChaptersList] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState([]);
  const [dataFteched, setdataFetched] = useState(false);
  const [chapterFetched, setChapterFetched] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("/videos.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setVideosList(data);
        setdataFetched(true);
      } catch (error) {
        console.error("Error fetching Videos:", error);
      }
    };
    fetchVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function fetchChapters() {
      if (videosList.length > 0) {
        await setChaptersList(videosList.map((chapters) => chapters.chapter));
        setChapterFetched(true);
      }
    }
    fetchChapters();
    // eslint-disable-next-line
  }, [videosList]);

  const onSelectedChapter = (chapter) => {
    setSelectedChapter(videosList[chapter].lessons);
    // console.log(videosList[chapter]);
  };

  console.log(selectedChapter);

  return (
    <div className="VideoPlayer">
      <ChapterList
        chapters={chaptersList}
        onSelectedChapter={onSelectedChapter}
      />
    </div>
  );
}
