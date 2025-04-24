import { Button } from "@/app/components/ui/Button";
import Container from "@/app/components/layout/Container";
import { Card,CardContent } from "@/app/components/ui/Card";

export default function CompanyPeople({ key, people }) {
    return(
        <Container>
            <Card className="w-80 rounded-xl shadow-md bg-foreground">
                <CardContent className="flex flex-col items-center text-center p-12">
                    <img
                    src={people?.profilePicture}
                    alt="Profile picture"
                    className="w-30 h-30 rounded-full -mt-10 border-4 border-white shadow"
                    />
                    <h3 className="mt-2 font-semibold text-lg">{people?.name}</h3>
                    <p className="text-muted-foreground text-sm mb-1">{people?.headline}</p>
                    <Button variant="default" className="bg-secondary cursor-pointer">Connect</Button>
                </CardContent>
            </Card>
        </Container>
    );
}