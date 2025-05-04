import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Education, { EducationCard } from "./Education"; // Import both default and named export if needed, or adjust based on actual export

// --- Mocks ---
jest.mock(
  "@/app/components/layout/Container",
  () =>
    ({ children, className, ...props }) =>
      (
        <div className={className} {...props}>
          {children}
        </div>
      )
);
jest.mock("@/app/components/ui/Separator", () => ({
  Separator: () => <hr data-testid="separator" />,
}));
jest.mock("../container/ModEducation", () =>
  jest.fn(({ adding, education }) => (
    <button
      data-testid={
        adding
          ? "add-education-button"
          : `edit-education-button-${
              education?._id || education?.school?.replace(/\s+/g, "-")
            }`
      }
    >
      {adding ? "Add" : "Edit"}
    </button>
  ))
);
jest.mock("lucide-react", () => ({
  ChevronDown: jest.fn(() => <svg data-testid="chevron-down"></svg>),
  ChevronUp: jest.fn(() => <svg data-testid="chevron-up"></svg>),
  // Edit and Plus icons are used within ModEducation mock, so no need to mock here unless used directly
}));
jest.mock("@mui/icons-material", () => ({
  School: jest.fn(() => <svg data-testid="school-icon"></svg>),
}));
// Mock next/image if EducationCard uses it directly (it doesn't seem to in the provided code)
// jest.mock('next/image', () => ({ __esModule: true, default: (props) => <img {...props} /> }));

// --- Test Data ---
const mockEducationData = [
  {
    _id: "edu1",
    school: "University of Testing",
    degree: "Bachelor of Science",
    fieldOfStudy: "Computer Science",
    startDate: { month: "Sep", year: 2018 },
    endDate: { month: "May", year: 2022 },
    grade: "3.8 GPA",
    location: "Testville, TS",
    description: "Studied hard.",
    activities: "Coding Club, Chess Club",
    skills: ["Jest", "React Testing Library"],
  },
  {
    _id: "edu2",
    school: "Code Academy",
    degree: "Certificate",
    fieldOfStudy: "Web Development",
    startDate: { month: "Jan", year: 2023 },
    endDate: { month: "Jun", year: 2023 },
    grade: null, // No grade
    location: "Online",
    description: "Learned web technologies.",
    activities: null, // No activities
    skills: ["HTML", "CSS", "JavaScript"],
  },
  {
    _id: "edu3",
    school: "Management Institute",
    degree: "MBA",
    fieldOfStudy: "Business Administration",
    startDate: { month: "Aug", year: 2023 },
    endDate: { month: "Dec", year: 2024 },
    grade: "Distinction",
    location: "Business City, BC",
    description: "Focused on leadership.",
    activities: "Student Council",
    skills: ["Leadership", "Strategy"],
  },
  {
    _id: "edu4",
    school: "Art School",
    degree: "Associate Degree",
    fieldOfStudy: "Fine Arts",
    startDate: { month: "Sep", year: 2019 },
    endDate: { month: "May", year: 2021 },
    grade: null,
    location: "Artburg, AT",
    description: "Explored creativity.",
    activities: "Painting Club",
    skills: ["Painting", "Sculpture"],
  },
];

// --- Tests ---
describe("Education Presentation Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does not render if no education and not my profile", () => {
    render(
      <Education
        education={[]}
        allEducation={false}
        toggleAllEducation={jest.fn()}
        isMyProfile={false}
      />
    );
    expect(
      screen.queryByTestId("education-section-container")
    ).not.toBeInTheDocument();
  });

  it("renders placeholder if no education and is my profile", () => {
    render(
      <Education
        education={[]}
        allEducation={false}
        toggleAllEducation={jest.fn()}
        isMyProfile={true}
      />
    );
    expect(
      screen.getByTestId("education-section-container")
    ).toBeInTheDocument();
    expect(screen.getByTestId("education-placeholder")).toBeInTheDocument();
    expect(screen.getByText(/Add your education/)).toBeInTheDocument();
    expect(screen.getByTestId("add-education-button")).toBeInTheDocument(); // Add button in header
  });

  it("renders header with Add button only for my profile", () => {
    const { rerender } = render(
      <Education
        education={mockEducationData.slice(0, 1)}
        allEducation={false}
        toggleAllEducation={jest.fn()}
        isMyProfile={true}
      />
    );
    expect(screen.getByTestId("education-section-heading")).toHaveTextContent(
      "Education"
    );
    expect(screen.getByTestId("add-education-button")).toBeInTheDocument();

    rerender(
      <Education
        education={mockEducationData.slice(0, 1)}
        allEducation={false}
        toggleAllEducation={jest.fn()}
        isMyProfile={false}
      />
    );
    expect(screen.getByTestId("education-section-heading")).toHaveTextContent(
      "Education"
    );
    expect(
      screen.queryByTestId("add-education-button")
    ).not.toBeInTheDocument();
  });

  it("renders correct number of education entries initially (max 3)", () => {
    render(
      <Education
        education={mockEducationData} // Has 4 entries
        allEducation={false}
        toggleAllEducation={jest.fn()}
        isMyProfile={false}
      />
    );
    expect(screen.getAllByTestId(/education-card-edu/)).toHaveLength(3);
    expect(screen.getByTestId("education-card-edu1")).toBeInTheDocument();
    expect(screen.getByTestId("education-card-edu2")).toBeInTheDocument();
    expect(screen.getByTestId("education-card-edu3")).toBeInTheDocument();
    expect(screen.queryByTestId("education-card-edu4")).not.toBeInTheDocument();
    expect(screen.getAllByTestId("separator")).toHaveLength(2); // Separator between items
  });

  it("renders all education entries when allEducation is true", () => {
    render(
      <Education
        education={mockEducationData} // Has 4 entries
        allEducation={true}
        toggleAllEducation={jest.fn()}
        isMyProfile={false}
      />
    );
    expect(screen.getAllByTestId(/education-card-edu/)).toHaveLength(4);
    expect(screen.getByTestId("education-card-edu1")).toBeInTheDocument();
    expect(screen.getByTestId("education-card-edu2")).toBeInTheDocument();
    expect(screen.getByTestId("education-card-edu3")).toBeInTheDocument();
    expect(screen.getByTestId("education-card-edu4")).toBeInTheDocument();
    expect(screen.getAllByTestId("separator")).toHaveLength(3);
  });

  it('shows "Show all" button when more than 3 entries and not showing all', () => {
    const toggleFn = jest.fn();
    render(
      <Education
        education={mockEducationData} // Has 4 entries
        allEducation={false}
        toggleAllEducation={toggleFn}
        isMyProfile={false}
      />
    );
    const button = screen.getByTestId("toggle-education-button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(
      `Show all ${mockEducationData.length} places of education`
    );
    expect(screen.getByTestId("chevron-down")).toBeInTheDocument();
    fireEvent.click(button);
    expect(toggleFn).toHaveBeenCalledTimes(1);
  });

  it('shows "Show less" button when more than 3 entries and showing all', () => {
    const toggleFn = jest.fn();
    render(
      <Education
        education={mockEducationData} // Has 4 entries
        allEducation={true}
        toggleAllEducation={toggleFn}
        isMyProfile={false}
      />
    );
    const button = screen.getByTestId("toggle-education-button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Show less");
    expect(screen.getByTestId("chevron-up")).toBeInTheDocument();
    fireEvent.click(button);
    expect(toggleFn).toHaveBeenCalledTimes(1);
  });

  it("does not show toggle button if 3 or less entries", () => {
    render(
      <Education
        education={mockEducationData.slice(0, 3)} // Has 3 entries
        allEducation={false}
        toggleAllEducation={jest.fn()}
        isMyProfile={false}
      />
    );
    expect(
      screen.queryByTestId("toggle-education-button")
    ).not.toBeInTheDocument();
  });

  // EducationCard Tests (within Education)
  describe("EducationCard rendering", () => {
    const eduWithGradeAndActivities = mockEducationData[0];
    const eduWithoutGradeAndActivities = mockEducationData[1];

    it("renders education details correctly (with grade and activities)", () => {
      render(
        <Education
          education={[eduWithGradeAndActivities]}
          allEducation={true}
          toggleAllEducation={jest.fn()}
          isMyProfile={false}
        />
      );
      const id = eduWithGradeAndActivities._id;
      const card = screen.getByTestId(`education-card-${id}`);
      expect(card).toBeInTheDocument();
      expect(
        screen.getByTestId(`education-icon-container-${id}`)
      ).toBeInTheDocument();
      expect(screen.getByTestId(`education-icon-${id}`)).toBeInTheDocument();
      expect(
        screen.getByTestId(`education-school-heading-${id}`)
      ).toHaveTextContent(eduWithGradeAndActivities.school);
      expect(
        screen.getByTestId(`education-degree-field-${id}`)
      ).toHaveTextContent(
        `${eduWithGradeAndActivities.degree}•${eduWithGradeAndActivities.fieldOfStudy}`
      );
      expect(screen.getByTestId(`education-dates-${id}`)).toHaveTextContent(
        `${eduWithGradeAndActivities.startDate.month.substring(0, 3)}. ${
          eduWithGradeAndActivities.startDate.year
        } - ${eduWithGradeAndActivities.endDate.month.substring(0, 3)}. ${
          eduWithGradeAndActivities.endDate.year
        }`
      );
      expect(screen.getByTestId(`education-grade-${id}`)).toHaveTextContent(
        `Grade: ${eduWithGradeAndActivities.grade}`
      );
      expect(screen.getByTestId(`education-location-${id}`)).toHaveTextContent(
        eduWithGradeAndActivities.location
      );
      expect(
        screen.getByTestId(`education-description-${id}`)
      ).toHaveTextContent(eduWithGradeAndActivities.description);
      expect(
        screen.getByTestId(`education-activities-heading-${id}`)
      ).toHaveTextContent("Activities and Societies:");
      expect(
        screen.getByTestId(`education-activities-text-${id}`)
      ).toHaveTextContent(eduWithGradeAndActivities.activities);
      expect(
        screen.getByTestId(`education-skills-container-${id}`)
      ).toBeInTheDocument();
      expect(screen.getByTestId(`education-skill-${id}-0`)).toHaveTextContent(
        eduWithGradeAndActivities.skills[0]
      );
      expect(screen.getByTestId(`education-skill-${id}-1`)).toHaveTextContent(
        eduWithGradeAndActivities.skills[1]
      );
    });

    it("renders education details correctly (without grade and activities)", () => {
      render(
        <Education
          education={[eduWithoutGradeAndActivities]}
          allEducation={true}
          toggleAllEducation={jest.fn()}
          isMyProfile={false}
        />
      );
      const id = eduWithoutGradeAndActivities._id;
      expect(screen.getByTestId(`education-card-${id}`)).toBeInTheDocument();
      expect(
        screen.getByTestId(`education-school-heading-${id}`)
      ).toHaveTextContent(eduWithoutGradeAndActivities.school);
      expect(
        screen.getByTestId(`education-degree-field-${id}`)
      ).toHaveTextContent(
        `${eduWithoutGradeAndActivities.degree}•${eduWithoutGradeAndActivities.fieldOfStudy}`
      );
      expect(screen.getByTestId(`education-dates-${id}`)).toHaveTextContent(
        `${eduWithoutGradeAndActivities.startDate.month.substring(0, 3)}. ${
          eduWithoutGradeAndActivities.startDate.year
        } - ${eduWithoutGradeAndActivities.endDate.month.substring(0, 3)}. ${
          eduWithoutGradeAndActivities.endDate.year
        }`
      );
      expect(
        screen.queryByTestId(`education-grade-${id}`)
      ).not.toBeInTheDocument();
      expect(screen.getByTestId(`education-location-${id}`)).toHaveTextContent(
        eduWithoutGradeAndActivities.location
      );
      expect(
        screen.getByTestId(`education-description-${id}`)
      ).toHaveTextContent(eduWithoutGradeAndActivities.description);
      expect(
        screen.queryByTestId(`education-activities-heading-${id}`)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId(`education-activities-text-${id}`)
      ).not.toBeInTheDocument();
      expect(
        screen.getByTestId(`education-skills-container-${id}`)
      ).toBeInTheDocument();
      expect(screen.getByTestId(`education-skill-${id}-0`)).toHaveTextContent(
        eduWithoutGradeAndActivities.skills[0]
      );
      expect(screen.getByTestId(`education-skill-${id}-1`)).toHaveTextContent(
        eduWithoutGradeAndActivities.skills[1]
      );
      expect(screen.getByTestId(`education-skill-${id}-2`)).toHaveTextContent(
        eduWithoutGradeAndActivities.skills[2]
      );
    });

    it("renders Edit button only for my profile", () => {
      const edu = mockEducationData[0];
      const id = edu._id;
      const { rerender } = render(
        <Education
          education={[edu]}
          allEducation={true}
          toggleAllEducation={jest.fn()}
          isMyProfile={true}
        />
      );
      expect(
        screen.getByTestId(`edit-education-button-${id}`)
      ).toBeInTheDocument();

      rerender(
        <Education
          education={[edu]}
          allEducation={true}
          toggleAllEducation={jest.fn()}
          isMyProfile={false}
        />
      );
      expect(
        screen.queryByTestId(`edit-education-button-${id}`)
      ).not.toBeInTheDocument();
    });
  });
});
