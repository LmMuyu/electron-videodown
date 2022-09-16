import { MongoClient } from "mongodb";
import { MyReturnType } from "../../type/commom";

const URL = "mongodb://120.27.135.200:27017";

const clinet = new MongoClient(URL);

async function base() {
  try {
    await clinet.connect();
    console.log("mogodb数据库已连接");

    function Db(namedb: string) {
      return clinet.db(namedb);
    }

    function createCollection(collectionName: string, db: MyReturnType<typeof clinet.db>) {
      if (!db || !collectionName) return;

      return db.collection(collectionName);
    }

    return {
      Db,
      createCollection,
    };
  } catch (error) {
    console.log("mogodb数据库连接出错");
    console.log(error);
    return null;
  }
}

export default base;
