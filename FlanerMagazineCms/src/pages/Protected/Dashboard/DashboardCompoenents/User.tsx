import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import UsersTable from "../components/UserList";
import CreateUser from "../components/CreateUser";
import UpdateUser from "../components/UpdateUser";

function User() {
  return (
    <div>
      <Tabs>
        <TabList>
          <Tab>Users</Tab>
          <Tab>Create User</Tab>
          <Tab>Update User</Tab>
        </TabList>

        <TabPanel>
          <div>
            <UsersTable />
          </div>
        </TabPanel>
        <TabPanel>
          <div>
            <CreateUser />
          </div>
        </TabPanel>
        <TabPanel>
          <div>
            <UpdateUser />
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default User;
