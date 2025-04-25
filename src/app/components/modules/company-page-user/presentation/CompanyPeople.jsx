import { Button } from "@/app/components/ui/Button";
import Container from "@/app/components/layout/Container";
import { Card,CardContent } from "@/app/components/ui/Card";

/**
 * @namespace CompanyPeople
 * @component
 * 
 * A component that displays a list of people you may know, with their profile information and a connect button.
 */

/**
 * The `CompanyPeople` component renders a list of people, each with a profile picture, name, relation to the user, headline, and a connect button.
 *
 * @param {CompanyPeople.Props} props - The component's props.
 * @param {Array<CompanyPeople.Person>} [props.people=[]] - A list of people to display.
 * 
 * @returns {JSX.Element} A JSX element rendering a list of people with profile pictures, names, relations, headlines, and a "Connect" button.
 */

/**
 * @namespace CompanyPeople.Person
 * @description Represents a person in the list of people you may know.
 */

/**
 * @typedef {Object} CompanyPeople.Person
 * @property {string} username - The unique username of the person (used as key).
 * @property {string} profilePicture - The URL of the person's profile picture.
 * @property {string} name - The name of the person.
 * @property {string} relation - The person's relation to the user (e.g., "Colleague").
 * @property {string} headline - A short description of the person's role or expertise.
 */

/**
 * @namespace CompanyPeople.Props
 * @description Defines the props that are passed to the `CompanyPeople` component.
 */

/**
 * @typedef {Object} CompanyPeople.Props
 * @property {Array<CompanyPeople.Person>} [people=[]] - A list of people to display.
 */

export default function CompanyPeople({ key, people=[] }) {
    return(
        <Container className="p-4">
            <h2 className="text-xl font-bold mb-4 text-text">People you may know</h2>
            <Card className="w-80 rounded-xl bg-foreground">
            {people.map((person, index)=>(
                <CardContent key={person.username || index} className="flex flex-col items-center text-center p-4 pt-12 ">
                    <img
                    src={person.profilePicture}
                    alt="Profile picture"
                    className="w-30 h-30 rounded-full -mt-10 border-4 border-white shadow"
                    />
                    <div className="flex flex-row gap-2 mb-1">
                        <h3 className="mt-2 font-semibold text-lg">{person?.name} . {" "}</h3>
                        <p className="text-muted-foreground  mt-3">{person?.relation}</p>
                    </div>
                    <p className="text-muted-foreground text-sm mb-2">{person?.headline}</p>
                    <Button variant="default" className="bg-secondary w-full rounded-xl cursor-pointer">Connect</Button>
                </CardContent>
            ))}
            </Card>
        </Container>
    );
}