"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/Table"
import { Badge } from "@/app/components/ui/Badge"
import { MessageSquare } from "lucide-react"



export function MostActiveUsersTable({users}) {
  console.log("users", users)
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Industry</TableHead>
          <TableHead>Posts</TableHead>
          <TableHead>Last Active</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.industry}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{user.posts}</Badge>
                <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {new Date(user.last_active).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
