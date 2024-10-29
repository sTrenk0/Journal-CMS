import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import PostList from "../components/PostList";
import NewPost from "../components/NewPost";

function Posts() {
  return (
    <div>
      <Tabs>
        <TabList>
          <Tab>Posts</Tab>
          <Tab>New Post</Tab>
        </TabList>

        <TabPanel>
          <div>
            <PostList />
          </div>
        </TabPanel>
        <TabPanel>
          <div>
            <NewPost />
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default Posts;
