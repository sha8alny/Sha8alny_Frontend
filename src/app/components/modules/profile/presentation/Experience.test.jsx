import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Experience, { ExperienceCard } from "./Experience"; // Import both default and named export
import ModExperience from "../container/ModExperience"; // Mock this

// Mock child components and dependencies
jest.mock("../container/ModExperience", () =>
  jest.fn(() => <div data-testid="mod-experience-mock">ModExperience</div>)
);
jest.mock("../container/ExperienceCardContainer", () =>
  jest.fn(({ experienceId }) => (
    <div data-testid={`experience-card-container-${experienceId}`}>
      ExperienceCardContainer
    </div>
  ))
); // Mock if ExperienceCardContainer is used directly, but ExperienceCard is used here
jest.mock("@/app/components/layout/Container", () =>
  jest.fn(({ children, ...props }) => (
    <div data-testid="container-mock" {...props}>
      {children}
    </div>
  ))
);
jest.mock("@/app/components/ui/Separator", () =>
  jest.fn(() => <hr data-testid="separator-mock" />)
);
jest.mock("lucide-react", () => ({
  Plus: () => <svg data-testid="plus-icon" />,
  Edit: () => <svg data-testid="edit-icon" />,
  ChevronDown: () => <svg data-testid="chevron-down-icon" />,
  ChevronUp: () => <svg data-testid="chevron-up-icon" />,
}));
jest.mock("@mui/icons-material", () => ({
  Business: () => <svg data-testid="business-icon" />,
}));

const mockExperience = [
  {
    _id: "exp1",
    title: "Software Engineer",
    company: "Tech Corp",
    employmentType: "Full-time",
    startDate: { month: "January", year: 2020 },
    endDate: { month: "Present", year: 2024 }, // Adjusted for 'Present' case
    isCurrent: true,
    location: "San Francisco, CA",
    description: "Developed cool stuff.",
    skills: ["React", "Node.js"],
  },
  {
    _id: "exp2",
    title: "Frontend Developer",
    company: "Web Solutions",
    employmentType: "Contract",
    startDate: { month: "June", year: 2018 },
    endDate: { month: "December", year: 2019 },
    isCurrent: false,
    location: "Remote",
    description: "Built user interfaces.",
    skills: ["HTML", "CSS", "JavaScript"],
  },
  {
    _id: "exp3",
    title: "Intern",
    company: "Startup Inc.",
    employmentType: "Internship",
    startDate: { month: "May", year: 2017 },
    endDate: { month: "August", year: 2017 },
    isCurrent: false,
    location: "New York, NY",
    description: "Learned a lot.",
    skills: ["Git"],
  },
  {
    _id: "exp4",
    title: "Senior Software Engineer",
    company: "Innovate LLC",
    employmentType: "Full-time",
    startDate: { month: "March", year: 2015 },
    endDate: { month: "May", year: 2018 },
    isCurrent: false,
    location: "Austin, TX",
    description: "Led frontend team.",
    skills: ["Angular", "TypeScript"],
  },
];

// Helper function to calculate duration (simplified for testing)
const calculateDuration = (start, end, isCurrent) => {
  if (isCurrent) return "4 yrs 5 mos"; // Example duration
  const startYear = start.year;
  const endYear = end.year;
  const durationYears = endYear - startYear;
  // Basic month calculation for testing
  const durationMonths = Math.abs(
    new Date(
      end.year,
      end.month === "Present"
        ? new Date().getMonth()
        : new Date(Date.parse(end.month + " 1, 2012")).getMonth()
    ) - new Date(Date.parse(start.month + " 1, 2012")).getMonth()
  );
  return `${durationYears} yrs ${durationMonths} mos`;
};

describe("ExperienceCard Component", () => {
  const job = mockExperience[0];
  const duration = calculateDuration(job.startDate, job.endDate, job.isCurrent);

  it("renders experience details correctly", () => {
    render(
      <ExperienceCard job={job} duration={duration} isMyProfile={false} />
    );

    expect(
      screen.getByTestId(`experience-card-${job._id}`)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`experience-title-heading-${job._id}`)
    ).toHaveTextContent(job.title);
    expect(
      screen.getByTestId(`experience-company-type-${job._id}`)
    ).toHaveTextContent(`${job.company}`);
    expect(
      screen.getByTestId(`experience-company-type-${job._id}`)
    ).toHaveTextContent(`${job.employmentType}`);
    expect(
      screen.getByTestId(`experience-dates-duration-${job._id}`)
    ).toHaveTextContent("Jan. 2020 - Present 2024"); // Check date format
    expect(
      screen.getByTestId(`experience-dates-duration-${job._id}`)
    ).toHaveTextContent(duration);
    expect(
      screen.getByTestId(`experience-location-${job._id}`)
    ).toHaveTextContent(job.location);
    expect(
      screen.getByTestId(`experience-description-${job._id}`)
    ).toHaveTextContent(job.description);
    expect(
      screen.getByTestId(`experience-skills-container-${job._id}`)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`experience-skill-${job._id}-0`)
    ).toHaveTextContent(job.skills[0]);
    expect(
      screen.getByTestId(`experience-skill-${job._id}-1`)
    ).toHaveTextContent(job.skills[1]);
    expect(screen.queryByTestId("mod-experience-mock")).not.toBeInTheDocument(); // Edit button shouldn't be there
  });

  it("renders experience details correctly for non-current job", () => {
    const nonCurrentJob = mockExperience[1];
    const nonCurrentDuration = calculateDuration(
      nonCurrentJob.startDate,
      nonCurrentJob.endDate,
      nonCurrentJob.isCurrent
    );
    render(
      <ExperienceCard
        job={nonCurrentJob}
        duration={nonCurrentDuration}
        isMyProfile={false}
      />
    );

    expect(
      screen.getByTestId(`experience-dates-duration-${nonCurrentJob._id}`)
    ).toHaveTextContent("Jun. 2018 - Dec. 2019"); // Check date format for non-current
    expect(
      screen.getByTestId(`experience-dates-duration-${nonCurrentJob._id}`)
    ).toHaveTextContent(nonCurrentDuration);
  });

  it("renders edit button when isMyProfile is true", () => {
    render(<ExperienceCard job={job} duration={duration} isMyProfile={true} />);
    expect(screen.getByTestId("mod-experience-mock")).toBeInTheDocument();
  });

  it("uses title for testid if _id is missing", () => {
    const jobWithoutId = { ...job, _id: undefined };
    const expectedTestId = job.title.replace(/\s+/g, "-");
    render(
      <ExperienceCard
        job={jobWithoutId}
        duration={duration}
        isMyProfile={false}
      />
    );
    expect(
      screen.getByTestId(`experience-card-${expectedTestId}`)
    ).toBeInTheDocument();
  });
});

describe("Experience Component", () => {
  const toggleAllExperienceMock = jest.fn();

  beforeEach(() => {
    toggleAllExperienceMock.mockClear();
    // Clear mocks for ModExperience if needed, though it's mocked globally
    jest.clearAllMocks();
  });

  it("renders nothing if no experience and not my profile", () => {
    const { container } = render(
      <Experience
        experience={[]}
        allExperience={false}
        toggleAllExperience={toggleAllExperienceMock}
        isMyProfile={false}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders container and add button if no experience but is my profile", () => {
    render(
      <Experience
        experience={[]}
        allExperience={false}
        toggleAllExperience={toggleAllExperienceMock}
        isMyProfile={true}
      />
    );
    expect(screen.getByTestId("container-mock")).toBeInTheDocument();
    expect(screen.getByTestId("add-experience-button")).toBeInTheDocument();
    expect(screen.queryByTestId(/experience-card-/)).not.toBeInTheDocument(); // No experience cards
  });

  it("renders the first 3 experiences by default", () => {
    render(
      <Experience
        experience={mockExperience}
        allExperience={false}
        toggleAllExperience={toggleAllExperienceMock}
        isMyProfile={false}
      />
    );
    expect(
      screen.getByTestId(`experience-card-${mockExperience[0]._id}`)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`experience-card-${mockExperience[1]._id}`)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`experience-card-${mockExperience[2]._id}`)
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId(`experience-card-${mockExperience[3]._id}`)
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("show-more-less-button")).toHaveTextContent(
      "Show all 4 experiences"
    );
    expect(screen.getByTestId("chevron-down-icon")).toBeInTheDocument();
  });

  it("renders all experiences when allExperience is true", () => {
    render(
      <Experience
        experience={mockExperience}
        allExperience={true}
        toggleAllExperience={toggleAllExperienceMock}
        isMyProfile={false}
      />
    );
    expect(
      screen.getByTestId(`experience-card-${mockExperience[0]._id}`)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`experience-card-${mockExperience[1]._id}`)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`experience-card-${mockExperience[2]._id}`)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`experience-card-${mockExperience[3]._id}`)
    ).toBeInTheDocument();
    expect(screen.getByTestId("show-more-less-button")).toHaveTextContent(
      "Show less"
    );
    expect(screen.getByTestId("chevron-up-icon")).toBeInTheDocument();
  });

  it('calls toggleAllExperience when "Show more/less" button is clicked', () => {
    render(
      <Experience
        experience={mockExperience}
        allExperience={false}
        toggleAllExperience={toggleAllExperienceMock}
        isMyProfile={false}
      />
    );
    const button = screen.getByTestId("show-more-less-button");
    fireEvent.click(button);
    expect(toggleAllExperienceMock).toHaveBeenCalledTimes(1);
  });

  it("renders add and edit buttons when isMyProfile is true", () => {
    render(
      <Experience
        experience={[mockExperience[0]]} // Only one experience for simplicity
        allExperience={false}
        toggleAllExperience={toggleAllExperienceMock}
        isMyProfile={true}
      />
    );
    expect(screen.getByTestId("add-experience-button")).toBeInTheDocument();
    // Check if ModExperience mock is rendered within the ExperienceCard
    // Need to render ExperienceCard directly or ensure Experience renders it
    // Re-rendering ExperienceCard to check ModExperience presence
    const job = mockExperience[0];
    const duration = calculateDuration(
      job.startDate,
      job.endDate,
      job.isCurrent
    );
    render(<ExperienceCard job={job} duration={duration} isMyProfile={true} />);
    expect(screen.getByTestId("mod-experience-mock")).toBeInTheDocument();
  });

  it('does not render "Show more/less" button if 3 or fewer experiences', () => {
    render(
      <Experience
        experience={mockExperience.slice(0, 3)} // Only 3 experiences
        allExperience={false}
        toggleAllExperience={toggleAllExperienceMock}
        isMyProfile={false}
      />
    );
    expect(
      screen.queryByTestId("show-more-less-button")
    ).not.toBeInTheDocument();
  });

  it("renders separators between experience cards", () => {
    render(
      <Experience
        experience={mockExperience.slice(0, 2)} // Two experiences
        allExperience={false}
        toggleAllExperience={toggleAllExperienceMock}
        isMyProfile={false}
      />
    );
    // Expect one separator between the two cards
    expect(screen.getAllByTestId("separator-mock")).toHaveLength(1);
  });
});
