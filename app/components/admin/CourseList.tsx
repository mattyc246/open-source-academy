import type { Course } from '@prisma/client';
import type { PropsWithChildren } from 'react';

import React from 'react';
import styled from 'styled-components';
import { Link } from '@remix-run/react';

import Button from '../ui/Button';

import { fontSize } from '~/styles';

interface CourseListProps extends PropsWithChildren {
  courses?: Course[];
}

const Container = styled.div`
  height: 100%;
  padding: 1rem;
  overflow-y: auto;
`;
const NoCourses = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
const NoCoursesText = styled.div`
  font-size: ${fontSize.regular};
  margin-bottom: 1rem;
`;

const CourseList: React.FC<CourseListProps> = ({ courses }) => {
  return (
    <Container>
      {!courses || courses.length === 0 ? (
        <NoCourses>
          <NoCoursesText>No courses found.</NoCoursesText>
          <NoCoursesText>Try adding a new course!</NoCoursesText>
          <Link to="/admin/courses/add">
            <Button>Add Course</Button>
          </Link>
        </NoCourses>
      ) : (
        <></>
      )}
    </Container>
  );
};

export default CourseList;
