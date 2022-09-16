import base from "./base";
import type { Collection } from "mongodb";

let collectionInstance: Collection<Document> | null = null;

async function getDownloadVideoDb() {
  const dbName = "DownloadVideo";
  const baseInstance = await base();

  if (!(baseInstance === null)) {
    const db = baseInstance.Db(dbName);

    return {
      baseInstance,
      db,
    };
  }

  return null;
}

async function insert(data: any | any[]) {
  if (Array.isArray(data)) {
    const many = await collectionInstance?.insertMany(data);
    return many?.insertedIds;
  } else {
    const one = await collectionInstance?.insertOne(data);
    return one?.insertedId;
  }
}

async function findALL() {
  return await collectionInstance?.find().toArray();
}

async function deleteone(id: number) {
  return await collectionInstance?.deleteOne({ vid: id });
}

async function update(data: any) {
  const vid = data.vid;
  return await collectionInstance?.updateOne({ vid: vid }, data);
}

async function douyin() {
  console.log("获取下载视频的数据库");
  const video = await getDownloadVideoDb();

  if (video !== null) {
    const collectionName = "douyin";
    console.log("获取抖音视频的集合");
    //@ts-ignore
    collectionInstance = video.baseInstance.createCollection(
      collectionName,
      video.db
    );

    return {
      insert,
      findALL,
      deleteone,
      update,
    };
  }

  return null;
}

export { douyin };
