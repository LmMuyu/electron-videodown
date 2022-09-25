import videoDownLoad from "./downloadvideo";
import useIpcMainSeparationvideo from "./ffmpeg/separationAV";

const separationvideo = useIpcMainSeparationvideo();

export { videoDownLoad, separationvideo };
