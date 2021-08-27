import { UserType } from "@models/User";
import EditPage from "../../pages/[username]/settings/[route]/EditPage";
import PasswordPage from "../../pages/[username]/settings/[route]/password";

interface ComponentProps {
  user: UserType;
}

const data = [
  {
    pathname: "edit",
    component: ({ ...props }: ComponentProps) => <EditPage {...props} />,
    name: "Edit Settings",
  },
  {
    pathname: "password",
    component: ({ ...props }: ComponentProps) => <PasswordPage {...props} />,
    name: "Change password",
  },
];
export { data };
