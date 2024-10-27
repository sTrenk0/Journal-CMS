import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

function Posts() {
  return (
    <div>
      <Tabs>
        <TabList>
          <Tab>Posts</Tab>
          <Tab>New Post</Tab>
        </TabList>

        <TabPanel>
          <div>Posts</div>
        </TabPanel>
        <TabPanel>
          <div>New Post</div>
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default Posts;
