import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {debounceTime} from "rxjs";
import {map} from "rxjs/operators";
import {Project} from "../types/projects.type";
import {AngularFireStorage} from "@angular/fire/compat/storage";

const projectsCollectionName: string = "projects";

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(readonly firestore: AngularFirestore, readonly storage: AngularFireStorage) {
  }

  async addProject(title: string, createdAt: number, shortDesc: string, longDesc: string, subPageUrl: string, repoUrl: string, externalUrl: string, isFeatured: boolean, projectYear: number, imageUrl: string) {
    try {
      await this.firestore.collection(projectsCollectionName).add({
        title: title,
        entry_created_at: createdAt,
        short_desc: shortDesc,
        long_desc: longDesc,
        sub_page_url: subPageUrl,
        repo_url: repoUrl,
        external_url: externalUrl,
        is_featured: isFeatured,
        project_year: projectYear,
        image_url: imageUrl,
        views: 0,
        likes: 0,
        tags: [],
      });
      console.log("Successfully added");
    } catch (err) {
      throw err;
    }
  }

  async updateProject(id: string, title: string, lastUpdatedAt: number, shortDesc: string, longDesc: string, subPageUrl: string, repoUrl: string, externalUrl: string, isFeatured: boolean, projectYear: number, imageUrl: string) {
    try {
      await this.firestore.collection(projectsCollectionName).doc(id).update({
        title: title,
        entry_last_updated_at: lastUpdatedAt,
        short_desc: shortDesc,
        long_desc: longDesc,
        sub_page_url: subPageUrl,
        repo_url: repoUrl,
        external_url: externalUrl,
        is_featured: isFeatured,
        project_year: projectYear,
        image_url: imageUrl,
      });
    } catch (err) {
      throw err;
    }
  }

  getProjects() {
    return this.firestore.collection(projectsCollectionName, ref => ref.orderBy('project_year', 'desc'))
      .snapshotChanges()
      .pipe(
        debounceTime(300), // needed to not load everything twice
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as Project
            const id = a.payload.doc.id;
            return {...data, id}
          })
        })
      )
  }

  async deleteProject(id: string, imageUrl: string | null) {
    try {
      await this.firestore.collection(projectsCollectionName).doc(id).delete();
      if (imageUrl) this.storage.refFromURL(imageUrl).delete();
    } catch (err) {
      throw err;
    }
  }

  async likeProject(id: string, currentLikes: number) {
    try {
      await this.firestore.collection(projectsCollectionName).doc(id).update({
        likes: currentLikes + 1
      })
    } catch (err) {
      throw err;
    }
  }

  async featureProject(id: string, isFeatured: boolean, featuredProjects: number) {
    try {
      await this.firestore.collection(projectsCollectionName).doc(id).update({
        is_featured: isFeatured,
        featuredProjects: isFeatured ? featuredProjects + 1 : featuredProjects - 1
      })
    } catch (err) {
      throw err;
    }

  }

}
