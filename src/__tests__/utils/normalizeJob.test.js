const { normalizeJob } = require("../../app/utils/normalizeJob");


describe('normalizeJob utility', () => {
  it('should normalize a single job object correctly', () => {
    // Arrange
    const rawJob = {
      _id: '123',
      title: 'Software Engineer',
      companyData: {
        id: 'company1',
        name: 'Google',
        username: 'google',
        logo: 'logo.png',
        location: 'Mountain View'
      },
      location: 'California',
      workLocation: 'Remote',
      employmentType: 'Full-time',
      description: 'Job description here',
      industry: 'Technology',
      experience: '3-5 years',
      salary: 120000,
      isSavedByUser: true,
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z'
    };

    // Act
    const normalizedJob = normalizeJob(rawJob);

    // Assert
    expect(normalizedJob).toEqual({
      id: '123',
      company: {
        id: 'company1',
        name: 'Google',
        username: 'google',
        logo: 'logo.png',
        location: 'Mountain View'
      },
      title: 'Software Engineer',
      location: 'California',
      workLocation: 'Remote',
      employmentType: 'Full-time',
      description: 'Job description here',
      industry: 'Technology',
      experience: '3-5 years',
      salary: 120000,
      isSavedByUser: true,
      createdAt: new Date('2023-01-01T00:00:00Z'),
      updatedAt: new Date('2023-01-02T00:00:00Z'),
    });
  });

  it('should normalize an array of jobs correctly', () => {
    // Arrange
    const rawJobs = [
      {
        _id: '123',
        title: 'Software Engineer',
        companyData: { name: 'Google' },
        isSavedByUser: true
      },
      {
        _id: '456',
        title: 'Product Manager',
        companyData: { name: 'Facebook' },
        isSavedByUser: false
      }
    ];

    // Act
    const normalizedJobs = normalizeJob(rawJobs);

    // Assert
    expect(normalizedJobs).toHaveLength(2);
    expect(normalizedJobs[0].id).toBe('123');
    expect(normalizedJobs[0].company.name).toBe('Google');
    expect(normalizedJobs[1].id).toBe('456');
    expect(normalizedJobs[1].company.name).toBe('Facebook');
  });

  it('should handle missing or partial data correctly', () => {
    // Arrange
    const rawJob = {
      id: '789',
      // Missing companyData
      // Missing title
      location: 'New York',
      // Other fields missing
    };

    // Act
    const normalizedJob = normalizeJob(rawJob);

    // Assert
    expect(normalizedJob).toEqual({
      id: '789',
      company: {
        id: '',
        name: '',
        username: '',
        logo: '',
        location: null
      },
      title: '',
      location: 'New York',
      workLocation: '',
      employmentType: '',
      description: '',
      industry: '',
      experience: 'Not specified',
      salary: null,
      isSavedByUser: false,
      createdAt: null,
      updatedAt: null,
    });
  });

  it('should handle alternative id property', () => {
    // Arrange
    const rawJob = {
      id: 'alt-id', // Using id instead of _id
      title: 'Developer',
      companyData: { name: 'Amazon' }
    };

    // Act
    const normalizedJob = normalizeJob(rawJob);

    // Assert
    expect(normalizedJob.id).toBe('alt-id');
  });

  it('should handle different salary types correctly', () => {
    // Arrange
    const numericSalaryJob = { _id: '1', salary: 100000 };
    const stringSalaryJob = { _id: '2', salary: '80k-100k' };
    const nullSalaryJob = { _id: '3', salary: null };
    const undefinedSalaryJob = { _id: '4' }; // salary is undefined
    const objectSalaryJob = { _id: '5', salary: { min: 80000, max: 100000 } };

    // Act
    const normalizedNumeric = normalizeJob(numericSalaryJob);
    const normalizedString = normalizeJob(stringSalaryJob);
    const normalizedNull = normalizeJob(nullSalaryJob);
    const normalizedUndefined = normalizeJob(undefinedSalaryJob);
    const normalizedObject = normalizeJob(objectSalaryJob);

    // Assert
    expect(normalizedNumeric.salary).toBe(100000);
    expect(normalizedString.salary).toBe('80k-100k');
    expect(normalizedNull.salary).toBeNull();
    expect(normalizedUndefined.salary).toBeNull();
    expect(normalizedObject.salary).toBeNull();
  });

  it('should convert isSavedByUser to boolean', () => {
    // Arrange
    const truishJob = { _id: '1', isSavedByUser: 1 };
    const falsishJob = { _id: '2', isSavedByUser: 0 };
    const undefinedJob = { _id: '3' };

    // Act
    const normalizedTruish = normalizeJob(truishJob);
    const normalizedFalsish = normalizeJob(falsishJob);
    const normalizedUndefined = normalizeJob(undefinedJob);

    // Assert
    expect(normalizedTruish.isSavedByUser).toBe(true);
    expect(normalizedFalsish.isSavedByUser).toBe(false);
    expect(normalizedUndefined.isSavedByUser).toBe(false);
  });
});