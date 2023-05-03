import type { LoaderArgs } from '@remix-run/node';
import type { V2_MetaFunction } from '@remix-run/react';
import type { Course } from '@prisma/client';

import { useLoaderData } from '@remix-run/react';
import { typedjson } from 'remix-typedjson';

import React, { useState } from 'react';
import styled from 'styled-components';

import CourseList from '~/components/admin/CourseList';

import { db } from '~/utils/db.server';
import { breakpoints, colors } from '~/styles';

const Grid = styled.div`
  max-width: 1300px;
  width: 100%;
  height: calc(100vh - 72px);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(1, 1fr);
  grid-gap: 1rem;

  @media screen and (min-width: ${breakpoints.lg}) {
    padding: 1rem;
  }
`;
const CourseCol = styled.div`
  background-color: ${colors.primaryDark};
  grid-column: 1/13;
  grid-row: 1/2;
  overflow: auto;

  @media screen and (min-width: ${breakpoints.lg}) {
    grid-column: 1/7;
  }
`;
const LessonCol = styled.div`
  background-color: ${colors.primaryDark};
  grid-column: 1/13;
  grid-row: 1/2;
  overflow: auto;

  @media screen and (min-width: ${breakpoints.md}) {
    grid-column: 7/13;
  }
`;

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Admin | Open Source Academy' }];
};

export const loader = async ({ request }: LoaderArgs) => {
  const courses = await db.course.findMany();

  return typedjson({
    courses
  });
};

const Index: React.FC = () => {
  const [selectedCourse, setSelectCourse] = useState<Course | null>(null);
  const data = useLoaderData<typeof loader>();

  return (
    <Grid>
      <CourseCol hidden={Boolean(selectedCourse)}>
        <CourseList courses={data.courses} />
      </CourseCol>
      {selectedCourse && <LessonCol></LessonCol>}
    </Grid>
  );
};

export default Index;
