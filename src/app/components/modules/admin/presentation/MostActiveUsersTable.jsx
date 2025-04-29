"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/Table";
import { Badge } from "@/app/components/ui/Badge";

import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
export function MostActiveUsersTable({ users }) {
  console.log("users", users);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Comments</TableHead>
          <TableHead>Posts</TableHead>
          <TableHead>Last Active</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              {" "}
              <div className="flex items-center gap-2 w-1/2 justify-center">
                <Badge className="text-text" variant="outline">
                  {user.comments}
                </Badge>
                <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: "1rem" }} className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center w-1/2 justify-center gap-2">
                <Badge className="text-text" variant="outline">
                  {user.posts}
                </Badge>
                <ArticleOutlinedIcon sx={{ fontSize: "1rem" }} className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {new Date(user.lastActive).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
