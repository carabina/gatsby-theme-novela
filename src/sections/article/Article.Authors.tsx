import React, { useState } from "react";
import styled from "@emotion/styled";
import OutsideClickHandler from "react-outside-click-handler";
import { useColorMode } from "theme-ui";

import Image from "@components/Image";
import Icons from "@icons";
import mediaqueries from "@styles/media";
import { IAuthor } from "@typings";

/**
 * Novela supports multiple authors and therefore we need to ensure
 * we render the right UI when there are varying amount of authors.
 */
function ArticleAuthors({ authors }: { authors: IAuthor[] }) {
  const hasCoAuthors = authors.length > 1;

  // Special dropdown UI for multiple authors
  if (hasCoAuthors) {
    return <CoAuthors authors={authors} />;
  }

  return (
    <>
      <AuthorAvatar>
        <Image src={authors[0].node.avatar.image.fluid} />
      </AuthorAvatar>
      <strong>{authors[0].node.name}</strong>
      <HideOnMobile>,&nbsp;</HideOnMobile>
    </>
  );
}

export default ArticleAuthors;

/**
 *
 */
function CoAuthors({ authors }: { authors: IAuthor[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [colorMode] = useColorMode();
  const names = generateAuthorNames(authors);

  const fill = colorMode === "dark" ? "#fff" : "#000";
  const listWidth = { width: `${10 + authors.length * 15}px` };

  return (
    <CoAuthorsContainer onClick={() => setIsOpen(!isOpen)} isOpen={isOpen}>
      <CoAuthorsList style={listWidth}>
        {authors.map((author, index) => (
          <CoAuthorAvatar
            style={{ left: `${index * 15}px` }}
            key={author.node.name}
          >
            <Image src={author.node.avatar.image.fluid} />
          </CoAuthorAvatar>
        ))}
      </CoAuthorsList>
      <NameContainer>{names}</NameContainer>
      <IconContainer>
        <Icons.ToggleOpen fill={fill} />
      </IconContainer>

      {isOpen && (
        <OutsideClickHandler onOutsideClick={() => setIsOpen(!isOpen)}>
          <CoAuthorsListOpen>
            <IconOpenContainer>
              <Icons.ToggleClose fill={fill} />
            </IconOpenContainer>
            {authors.map(author => (
              <CoAuthorsListItemOpen key={author.node.name}>
                <CoAuthorAvatarOpen>
                  <Image src={author.node.avatar.image.fluid} />
                </CoAuthorAvatarOpen>
                <AuthorNameOpen>{author.node.name}</AuthorNameOpen>
              </CoAuthorsListItemOpen>
            ))}
          </CoAuthorsListOpen>
        </OutsideClickHandler>
      )}
    </CoAuthorsContainer>
  );
}

/**
 * When generating the author names we're also checking to see how long the
 * number of authors are. If it's only 2 authors we'll show the fullnames.
 * Otherwise it'll only preview the first names of each author.
 */
function generateAuthorNames(authors: IAuthor[]) {
  return authors
    .map(author => {
      if (authors.length > 2) {
        return author.node.name.split(" ")[0];
      } else {
        return author.node.name;
      }
    })
    .join(", ");
}

const AuthorAvatar = styled.div`
  height: 25px;
  width: 25px;
  border-radius: 50%;
  margin-right: 14px;
  background: ${p => p.theme.colors.grey};
  overflow: hidden;

  .gatsby-image-wrapper > div {
    padding-bottom: 100% !important;
  }

  ${mediaqueries.phablet`
    display: none;
  `}
`;

const CoAuthorsList = styled.div`
  position: relative;
  height: 25px;
  margin-right: 15px;

  ${mediaqueries.phablet`
    display: none;
  `}
`;

const CoAuthorsListOpen = styled.ul`
  position: absolute;
  left: -21px;
  right: -21px;
  top: -19px;
  padding: 21px;
  background: ${p => p.theme.colors.card};
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  cursor: pointer;
  list-style: none;
  transform: translateY(-2px);
`;

const CoAuthorsListItemOpen = styled.li`
  display: flex;
  align-items: center;

  &:not(:last-child) {
    margin-bottom: 10px;
  }
`;

const CoAuthorAvatarOpen = styled.div`
  height: 25px;
  width: 25px;
  border-radius: 50%;
  margin-right: 15px;
  background: ${p => p.theme.colors.grey};
  overflow: hidden;

  .gatsby-image-wrapper > div {
    padding-bottom: 100% !important;
  }
`;

const CoAuthorAvatar = styled.div`
  position: absolute;
  height: 25px;
  width: 25px;
  border-radius: 50%;
  background: ${p => p.theme.colors.grey};
  box-shadow: 0 0 0 2px ${p => p.theme.colors.background};
  transition: box-shadow 0.25s ease;
  overflow: hidden;

  .gatsby-image-wrapper > div {
    padding-bottom: 100% !important;
  }

  ${mediaqueries.phablet`
    display: none;
  `}
`;

const NameContainer = styled.strong`
  position: relative;
  max-width: 260px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
  cursor: pointer;

  ${mediaqueries.desktop`
    max-width: 120px;
  `}

  ${mediaqueries.phablet`
    max-width: 200px;
  `}
`;

const AuthorNameOpen = styled.strong`
  position: relative;
  cursor: pointer;
  color: ${p => p.theme.colors.secondary};
  font-weight: 600;
`;

const IconContainer = styled.div`
  position: relative;
  cursor: pointer;
  margin-left: 10px;

  ${mediaqueries.phablet`
    position: absolute;
    right: 0;
    bottom: 0;
    top: 10px;
    height: 100%;
  `}
`;

const IconOpenContainer = styled.div`
  position: absolute;
  cursor: pointer;
  top: 20px;
  right: 21px;
`;

const CoAuthorsContainer = styled.div<{ isOpen: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  font-size: 18px;
  color: ${p => p.theme.colors.grey};

  &::before {
    content: "";
    position: absolute;
    left: -20px;
    right: -20px;
    top: -16px;
    bottom: -16px;
    background: ${p => p.theme.colors.card};
    box-shadow: ${p =>
      p.isOpen ? "none" : " 0px 0px 15px rgba(0, 0, 0, 0.1)"};
    border-radius: 5px;
    z-index: 0;
    transition: opacity 0.3s;
    cursor: pointer;
    opacity: 0;
  }

  &:hover::before {
    opacity: 1;
  }

  ${mediaqueries.phablet`
    font-size: 14px;
    align-items: center;

    &::before {
      box-shadow: none;
      bottom: -30px;
      background: transparent;
    }


    strong {
      display: block;
      font-weight: semi-bold;
      margin-bottom: 5px;
    }
  `}
`;

const HideOnMobile = styled.span`
  ${mediaqueries.phablet`
    display: none;
  `}
`;
