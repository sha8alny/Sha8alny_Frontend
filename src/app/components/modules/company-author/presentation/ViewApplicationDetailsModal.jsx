"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/Avatar"
import { Badge } from "@/app/components/ui/Badge"
import { Button } from "@/app/components/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/Dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/Select"
import { Separator } from "@/app/components/ui/Separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/Tabs"
import { Textarea } from "@/app/components/ui/Textarea"
import { Calendar, FileText, Mail, MapPin, Phone } from "lucide-react"
import { X } from "lucide-react";

/**
 * @namespace company-author
 * @module company-author
 */
/**
 * ViewApplicationDetailsModal component
 * 
 * This component displays the details of a job application in a modal dialog.
 * It shows the applicant's avatar, name, location, and allows updating the application status and notes.
 * 
 * @param {Object} props - Component props.
 * @param {Object} props.application - The application details object.
 * @param {string} props.application.avatar - The URL of the applicant's avatar.
 * @param {string} props.application.name - The name of the applicant.
 * @param {string} props.application.location - The location of the applicant.
 * @param {string} props.status - The current status of the application.
 * @param {string} props.notes - Notes related to the application.
 * @param {boolean} props.isUpdating - Indicates if the application is being updated.
 * @param {boolean} props.isLoading - Indicates if the application details are being loaded.
 * @param {Function} props.onClose - Callback function to handle closing the modal.
 * @param {Function} props.onStatusChange - Callback function to handle changes to the application status.
 * @param {Function} props.onNotesChange - Callback function to handle changes to the application notes.
 * @param {Function} props.onSave - Callback function to handle saving the application updates.
 * @param {boolean} props.open - Controls the visibility of the modal.
 * 
 * @returns {JSX.Element} The rendered modal component.
 * 
 * @example
 * <ViewApplicationDetailsModal
 *   application={{ avatar: "avatar.jpg", name: "John Doe", location: "New York" }}
 *   status="Pending"
 *   notes="Initial review completed."
 *   isUpdating={false}
 *   isLoading={false}
 *   onClose={() => {}}
 *   onStatusChange={(newStatus) => {}}
 *   onNotesChange={(newNotes) => {}}
 *   onSave={() => {}}
 *   open={true}
 * />
 */
const ViewApplicationDetailsModal = ({
    application,
    status,
    notes,
    isUpdating,
    isLoading,
    onClose,
    onStatusChange,
    onNotesChange,
    onSave,
    open,
}) => {
    return (
        <Dialog
            open={open}
            onOpenChange={onClose}
        >
           <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto" >
            <DialogHeader>
                <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                        <AvatarImage src={isLoading ? "Loading..." : application?.avatar} alt={isLoading ? "Loading..." : application?.name} />
                        <AvatarFallback>{isLoading ? "Loading..." : application?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                        <DialogTitle className="text-xl text-text">{isLoading ? "Loading..." : application?.name || "N/A"}</DialogTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{isLoading ? "Loading..." : application?.location || "N/A"}</span>
                        </div>
                    </div>
                    <Badge className="ml-auto" varient={status === "approved"? "success" : status === "rejected" ? "destructive": "outline"}>
                    {status === "review"
                    ? "Under Review"
                    : status === "approved"
                    ? "Approved"
                    : status === "rejected"
                    ? "Rejected"
                    : "Pending"}
                    </Badge>
                </div>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground font-thin">{isLoading ? "Loading..." : application?.email || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground font-thin">{isLoading ? "Loading..." : application?.phone || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground font-thin">{isLoading ? "Loading..." : application?.applied_date || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <a href={isLoading ? "Loading..." : application?.resume_url || "#"} className="text-primary hover-underline">
                        View Resume
                    </a>
                </div>
            </div>
            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="profile" className="col-span-1">
                        Profile
                    </TabsTrigger>
                    <TabsTrigger value="experience" className="col-span-1">
                        Experience
                    </TabsTrigger>
                    <TabsTrigger value="evaluation" className="col-span-1">
                        Evaluation
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="profile" className="space-y-4 pt-4">
                    <div>
                    <h3 className="text-sm text-text font-medium mb-2">About</h3>
                    <p className="text-sm text-muted-foreground">{application.about}||"N/A"</p>
                    </div>
                    <div>
                    <h3 className="text-sm text-text font-medium mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {application.skills?.map((skill) => (
                        <Badge key={skill} varient="secondary" >{skill}</Badge>
                        ))||"N/A"}
                    </div>
                    </div>
                </TabsContent>
                <TabsContent value="experience" className="space-y-4 pt-4">
                    <div>
                    <h3 className="text-sm text-text font-medium mb-2">Work Experience</h3>
                    {isLoading ? (
                    <p className="text-sm text-muted-foreground">Loading...</p>
                    ) : (
                    <ul className="list-disc pl-4">
                        {application.experience?.map((exp, index) => (
                        <li key={index} className="text-muted-foreground">
                            <strong className="text-text">{exp.title}</strong> at {exp.company} ({exp.duration})
                            <ul className="list-disc pl-6">
                            {exp.responsibilities.map((task, i) => (
                                <li key={i}>{task}</li>
                            ))}
                            </ul>
                        </li>
                        ))}
                    </ul>
                    )}
                    </div>
                    <div>
                    <h3 className="text-sm text-text font-medium mb-2">Education</h3>
                    {isLoading ? (
                    <p className="text-sm text-muted-foreground">Loading...</p>
                    ) : (
                    <ul className="list-disc pl-4">
                        {application.education?.map((edu, index) => (
                        <li key={index} className="text-muted-foreground">
                            <strong className="text-text">{edu.degree}</strong> - {edu.institution} ({edu.year})
                        </li>
                    )) || "Loading..."}
                    </ul>
                    )}         
               </div>
                </TabsContent>
                <TabsContent value="evaluation" className="space-y-4 pt-4">
                    <div>
                    <h3 className="text-sm text-text font-medium mb-2">Application Status</h3>
                    <Select value={status} onValueChange={onStatusChange} disabled={isUpdating} >
                  <SelectTrigger className="text-text">
                    <SelectValue placeholder="Select status"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="review" >Under Review</SelectItem>
                    <SelectItem value="interview">Schedule Interview</SelectItem>
                    <SelectItem value="approved">Approve</SelectItem>
                    <SelectItem value="rejected">Reject</SelectItem>
                  </SelectContent>
                </Select>
                </div>
                <div>
                    <h3 className="text-sm text-text font-medium mb-2">Interviewer Notes</h3>
                    <Textarea
                    value={notes}
                    onChange={(e) => onNotesChange(e.target.value)}
                    placeholder="Add your notes about this candidate..."
                    className="min-h-[120px] text-text"
                    />
                </div>
                </TabsContent>
                </Tabs>
                </div>
                <Separator />
                <DialogFooter className="gap-2 sm:gap-0 mt-4">
                <Button onClick={onSave} disabled={isUpdating}>
                    {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
                <Button variant="destructive" onClick={() => onStatusChange("rejected")} disabled={isUpdating} className="flex-1 sm:flex-none">
                {isUpdating && status === "rejected" ? "Rejecting..." : "Reject"}
                </Button>
                <Button variant="secondary" onClick={() => onStatusChange("approved")} disabled={isUpdating} className="flex-1 sm:flex-none">
                {isUpdating && status === "approved" ? "Approving..." : "Approve"}
                </Button>
                </DialogFooter>
            </DialogContent>
                  </Dialog>
    );
};

export default ViewApplicationDetailsModal;