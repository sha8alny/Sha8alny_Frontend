import { Button } from "@/app/components/ui/Button";
import Container from "@/app/components/layout/Container";
import { Card,CardContent } from "@/app/components/ui/Card";
import PersonAddIcon from '@mui/icons-material/PersonAdd';

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

export default function CompanyPeople({ people=[], loading=false, goToPeoplePage, handleConnectPerson, currentUsername}) {
  const getRelationText = (relation) => {
      if (relation === 1) return "1st";
      if (relation === 2) return "2nd";
      if (relation === 3) return "3rd";
      if(relation === -1) return "Owner";
      return `${relation}`; 
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-2 justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-secondary" /> 
          <p className="text-text">Loading</p>
      </div>
    );
  }

  if(!people.length){
    return (
        <div className="text-center py-6 text-text">
          No people work at this company.
        </div>
      );
  }

  return(
      <Container className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-text">People you may know</h2>
        <div className="flex flex-wrap gap-6 ml-6 space-x-4">
            {people.map((person, index)=>(
                <Card key={person.username || index} className="w-70 rounded-xl bg-foreground">
                    <CardContent  className="flex flex-col items-center text-center p-4 pt-12 ">
                        <img
                        src={person.profilePicture || "/placeholder.svg"}
                        alt="Profile picture"
                        className="w-30 h-30 rounded-full -mt-10 border-4 border-white shadow"
                        />
                        <div className="flex flex-row gap-2 mb-1">
                            <h3 className="mt-2 font-semibold text-lg cursor-pointer hover:underline transition-all duration-150" onClick={()=>goToPeoplePage(person)}>{person?.name} . {" "}</h3>
                            <p className="text-muted-foreground  mt-3">{getRelationText(person?.relation)}</p>
                        </div>
                        <p className="text-muted-foreground text-sm mb-2">{person?.headline}</p>
                        <div className="w-full">
                        {person.relation === -1 ? (
                          null
                          ) : person.connectionStatus === "connected" ? (
                            <Button
                              disabled
                              data-testid={`connected-button-${person.connectionStatus}`}
                              className="w-full rounded-xl cursor-not-allowed bg-secondary"
                            >
                              Connected
                            </Button>
                          ) : person.connectionStatus === "pending" ? (
                            <Button
                              disabled
                              data-testid={`pending-button-${person.connectionStatus}`}
                              className="w-full rounded-xl cursor-not-allowed bg-secondary"
                            >
                              Pending...
                            </Button>
                          ) : (
                            <Button
                              variant="default"
                              data-testid={`connect-button-${person.connectionStatus}`}
                              className="w-full rounded-xl cursor-pointer bg-secondary hover:bg-primary"
                              onClick={() => handleConnectPerson(person)}
                            >
                              <PersonAddIcon sx={{ fontSize: "20px" }} /> Connect
                            </Button>
                          )}
                        </div>
                      </CardContent>
                  </Card>
              ))}
          </div>
      </Container>
  );
}