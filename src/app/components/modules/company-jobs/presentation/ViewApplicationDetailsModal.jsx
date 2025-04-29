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
                    <Badge   
                        className={`ml-auto ${
                        status === "viewed"
                        ? "bg-yellow-500 text-white"
                        :
                        status === "accepted"
                        ? "bg-green-500 text-white"
                        : status === "rejected"
                        ? "bg-red-500 text-white"
                        : "bg-gray-200 text-black"
                    }`}>
                    {status === "viewed"
                    ? "Viewed"
                    : status === "accepted"
                    ? "Accepted"
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
                    <span className="text-muted-foreground font-thin">{isLoading ? "Loading..." : application?.phoneNumber || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground font-thin">
                {isLoading ? "Loading..."    
                : application?.createdAt
                ? new Date(application.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                })
                : "N/A"}
               </span>
                </div>
                <div className="flex items-center gap-2 text-sm"
                data-testid="resume-link"
                >
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <a href={isLoading ? "Loading..." : application?.resume || "#"} className="text-primary hover-underline hover:text-secondary" target="_blank" rel="noopener noreferrer">
                        View Resume
                    </a>
                </div>
            </div>
            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="profile" className="col-span-1" data-testid="profile-tab">
                        Profile
                    </TabsTrigger>
                    <TabsTrigger value="experience" className="col-span-1" data-testid="experience-tab">
                        Experience
                    </TabsTrigger>
                    <TabsTrigger value="evaluation" className="col-span-1" data-testid="evaluation-tab">
                        Evaluation
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="profile" className="space-y-4 pt-4">
                    <div>
                    <h3 className="text-sm text-text font-medium mb-2">About</h3>
                    <p className="text-sm text-muted-foreground">{application.about ||"N/A"}</p>
                    </div>
                    <div>
                    <h3 className="text-sm text-text font-medium mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {application.skills?.map((skill) => (
                        <Badge key={skill} varient="secondary" >{skill}</Badge>
                        ))||"N/A"}
                    </div>
                    </div>
                    <div>
                    <h3 className="text-sm text-text font-medium mb-2">Education</h3>
                    {isLoading ? (
                    <p className="text-sm text-muted-foreground">Loading...</p>
                    ) : (
                    <ul className="list-disc pl-4">
                        {application.education?.length > 0 ? (
                        application.education?.map((edu, index) => (
                        <li key={index} className="text-muted-foreground">
                            <strong className="text-text">{edu.degree || "N/A"} - {edu.fieldOfStudy} </strong>
                            {edu.school && (
                
                                <div className="text-text">{edu.school} </div>
                            )}
                            {edu.startDate && edu.endDate && (
                                <div className="text-muted-foreground text-sm flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-text" />
                                <span>
                                {edu.startDate.month} {edu.startDate.year} - {edu.endDate.month} {edu.endDate.year}
                                </span>
                                </div>
                            )}
                            {edu.grade && (
                                <div className="text-muted-foreground text-sm">
                                <strong className="text-text">Grade:</strong> {edu.grade}
                                </div>
                            )}
                            {edu.activities && (
                                <div className="text-muted-foreground text-sm">
                                <strong className="text-text">Activities:</strong> {edu.activities}
                                </div>
                            )}
                            {edu.description && (
                                <div   className="text-muted-foreground text-sm">
                                <strong className="text-text">Description:</strong> {edu.description}
                                </div>
                            )}
                            {edu.skills && (
                                <div className="text-muted-foreground">
                                <strong className="text-text text-sm">Skills:</strong>
                                <div className="flex flex-wrap gap-2">
                                 {edu.skills.length>0 ?(edu.skills.map((skill) => (
                                    <Badge key={skill} varient="secondary" >{skill}</Badge>
                                )) 
                            ):(
                                    <p className="text-sm text-muted-foreground">No Skills Mentioned</p>
                                )}
                                </div>
                                </div>
                            )}
                        </li>
                        ))
                        ) : (
                        <p className="text-sm text-muted-foreground">No Education Found</p>
                        )}
                    </ul>
                    )}         
               </div>
                <div>
                    <h3 className="text-sm text-text font-medium mb-2">Certifications</h3>
                    {isLoading ? (
                    <p className="text-sm text-muted-foreground">Loading...</p>
                    ) : (
                    <ul className="list-disc pl-4">
                        {application.certificates?.length > 0 ? (
                        application.certificates?.map((cert, index) => (
                        <li key={index} className="text-muted-foreground">
                            <strong className="text-text">{cert.name || "N/A"} </strong>
                            {cert.issuingOrganization && (
                                <div className="text-text">{cert.issuingOrganization} -                                     <a href={cert.certificationUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover-underline hover:text-secondary">
                                View Certification
                            </a></div>
                            )}
                            {cert.issueDate && cert.expirationDate && (
                                <div className="text-muted-foreground text-sm flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-text" />
                                {cert.issueDate.month} {cert.issueDate.year} - {cert.expirationDate.month} {cert.expirationDate.year}
                                </div>
                            )}
                            {cert.description && (
                                <div className="text-muted-foreground text-sm">
                                <strong className="text-text">Description:</strong> {cert.description}
                                </div>
                            )}
                                                     
                            {cert.skills && (
                                <div className="text-muted-foreground text-sm">
                                <strong className="text-text">Skills:</strong> 
                                <div className="flex flex-wrap gap-2">
                                {cert.skills.length>0 ?(cert.skills.map((skill) => (
                                    <Badge key={skill} varient="secondary" >{skill}</Badge>
                                ))
                                ):(
                                    <p className="text-sm text-muted-foreground">No Skills Mentioned</p>
                                )}
                                </div>
                                </div>
                            )}
                            
                        </li>
                        ))
                        ) : (
                        <p className="text-sm text-muted-foreground">No Certifications Found</p>
                        )}
                    </ul>
                    )}
                </div>
                </TabsContent>
                <TabsContent value="experience" className="space-y-4 pt-4">
                    <div>
                    {isLoading ? (
                    <p className="text-sm text-muted-foreground">Loading...</p>
                    ) : (
                    <ul className="list-disc pl-4">
                        {application.experience?.length > 0 ? (
                        application.experience?.map((exp, index) => (
                        <li key={index} className="text-muted-foreground">
                            <strong className="text-text">{exp.title || "N/A"} - {exp.employmentType}</strong>
                            {exp.company && (
                                <div className="text-text">{exp.company} - {exp.location}</div>
                            )}
                            {exp.startDate && exp.endDate && (
                                <div className="text-muted-foreground text-sm flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-text" />
                                {exp.startDate.month} {exp.startDate.year} - {exp.endDate.month} {exp.endDate.year}
                                </div>
                            )}
                            {exp.description && (
                                <div className="text-muted-foreground text-sm">
                                <strong className="text-text">Description:</strong> {exp.description}
                                </div>
                            )}

                            {exp.locationType && (
                                <div className="text-muted-foreground text-sm">
                                <strong className="text-text">Work Location:</strong> {exp.locationType}
                                </div>
                            )}
                            {exp.foundJobSource && (
                                <div className="text-muted-foreground text-sm">
                                <strong className="text-text">Found Job Source:</strong> {exp.foundJobSource}
                                </div>
                            )}
                            {exp.skills && (
                                <div className="text-muted-foreground text-sm">
                                <strong className="text-text">Skills:</strong> 
                                <div className="flex flex-wrap gap-2">
                                {exp.skills.length>0 ?(exp.skills.map((skill) => (
                                    <Badge key={skill} varient="secondary" >{skill}</Badge>
                                ))
                                ):(
                                    <p className="text-sm text-muted-foreground">No Skills Mentioned</p>
                                )}
                                </div>
                                </div>
                            )}
                            
                        </li>
                        ))
                        ) : (
                        <p className="text-sm text-muted-foreground text-center">No Experience Found</p>
                        )}
                    </ul>
                    )}
                    </div>
                </TabsContent>
                <TabsContent value="evaluation" className="space-y-4 pt-4">
                    <div>
                    <h3 className="text-sm text-text font-medium mb-2">Cover Letter</h3>
                    {application.coverLetter? (
                    <p className="text-muted-foreground">{application.coverLetter}</p>
                    ):(
                        <p className="text-sm text-muted-foreground">No Cover Letter Provided</p>
                    )
                    }
                    </div>
                    <div>
                    <h3 className="text-sm text-text font-medium mb-2">Application Status</h3>
                    <Select value={status} onValueChange={onStatusChange} disabled={isUpdating}  data-testid="status-select">
                  <SelectTrigger className="text-text">
                    <SelectValue placeholder="Select status"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="accepted">Approve</SelectItem>
                    <SelectItem value="rejected">Reject</SelectItem>
                  </SelectContent>
                </Select>
                </div>
                <div>
                    <h3 className="text-sm text-text font-medium mb-2">Interviewer Notes</h3>
                    <Textarea
                    data-testid="notes"
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
                <Button onClick={onSave} disabled={isUpdating} data-testid="save-button">
                    {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
                </DialogFooter>
            </DialogContent>
                  </Dialog>
    );
};

export default ViewApplicationDetailsModal;